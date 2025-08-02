export class LayoutEditor {

    /**
     * Initializes the editor with the given ldf file.
     * @param {Object} ldf 
     */
    constructor (ldf) {
        this.ldf = ldf;
        console.log("Created modifier with ", this.ldf);
        this.transformations = [];
    }

    processNode (parentId, width, height) {
        this.processSubTree (parentId, width, height);
        this.sendTransformations(parentId, this.transformations.reverse());
        this.transformations = [];
    }

    /**
     * Given an id with initial size, this function finds the
     * node in the tree and then processes its subtree recursively
     * and calculates the new sizes based on the initial size.
     * @param {String} parentId 
     * @param {Number} width 
     * @param {Number} height 
     */
    processSubTree (parentId, width, height) {
        const node = this.findTreeById(this.ldf.layout, parentId);

        if (!("children" in node) || node.children.length == 0) {
            return null;
        }

        const size = {
            width: width,
            height: height
        }

        let parentSize, fixedProp, dynamicProp, fixedPropPosition, offsetPropPosition;
        if (node.childType === "row") {
            dynamicProp = "height";
            fixedProp = "width";
            fixedPropPosition = "left";
            offsetPropPosition = "top";
            parentSize = size.height;
        } else if (node.childType === "column") {
            dynamicProp = "width";
            fixedProp = "height";
            fixedPropPosition = "top";
            offsetPropPosition = "left";
            parentSize = size.width;
        }

        let transformations = [];
        let offset = 0;

        node.children.forEach((child,index) => {
            let style = {};

            style["position"] = "absolute";
            // transformations.push([child.id, "style", "position", "absolute"])

            style[fixedPropPosition] = 0 + "px";
            // transformations.push([child.id, "style", fixedPropPosition, 0 + "px"])

            style[fixedProp] = size[fixedProp] + "px";
            // transformations.push([child.id, "style", fixedProp, style[fixedProp] + "px"])

            let renderHandle;
            switch(child.type) {
                case "px":
                    style[dynamicProp] = child[dynamicProp] + "px";
                    // transformations.push([child.id, "style", dynamicProp, child[dynamicProp]+ "px"])
                    renderHandle = (index < node.children.length - 1);
                    break;
                case "percent":
                    const sizeInPx = (child[dynamicProp]/100) * parentSize;
                    style[dynamicProp] = sizeInPx + "px";
                    // transformations.push([child.id, "style", dynamicProp, sizeInPx + "px"])
                    renderHandle = (index < node.children.length - 1);
                    break;
                case "fixed":
                    style[dynamicProp] = child[dynamicProp] + "px";
                    // transformations.push([child.id, "style", dynamicProp, child[dynamicProp] + "px"])
                    renderHandle = false;
                    break;
                case "fill":
                    // Subtract the size of the fixed siblings from parent size to get fill size
                    // Supported: [fixed][fill] [fill][fixed] [fixed][fill][fixed]
                    // Multiple fixed can be repeated: [fixed][fixed][fixed][fill]
                    style[dynamicProp] = size[dynamicProp] - node.children.reduce((sum, child) => {
                        return child[dynamicProp] != null ? sum + Number(child[dynamicProp]) : sum;
                    }, 0) + "px";
                    // transformations.push([child.id, "style", dynamicProp, style[dynamicProp] + "px"])
                    renderHandle = false;
                    break;
                default:
                    console.error("Child layout type is invalid!")
                    break;
            }

            style[offsetPropPosition] = offset + "px";
            // transformations.push([child.id, "style", offsetPropPosition, offset+ "px"])
            const widthNumber = Number(style[dynamicProp].substring(0, style[dynamicProp].length - 2));
            offset = offset + widthNumber;

            if ("background" in child) {
                style["background"] = child.background;
                // transformations.push([child.id, "style", "background", child.background])
            } 

            if ("children" in child) {
                // remove px
                const widthNumber = Number(style.width.substring(0, style.width.length - 2));
                const heightNumber = Number(style.height.substring(0, style.height.length - 2));
                // console.log(widthNumber, heightNumber);
                this.processSubTree(child.id, widthNumber, heightNumber);
            }

            transformations.push({id: child.id, style:style});
        });

        this.transformations.push({parentId: node.id, transformations: transformations});
    };

    /**
     * Passes a DOM transformation to the main thread.
     * @param {String} parentId - ID of the parent node in the layout tree.
     * @param {Array} transformations - An array of transformations.
     */
    sendTransformations (parentId, transformations) {
        postMessage({
            type: "transformations",
            parentId: parentId,
            data: transformations
        })
    }


    /**
     * Recursively processes tree to find the provided node.
     * 
     * TODO: This can be optimized if instead of the id, the 
     * full access key path is provided to get the node directly.
     * I am not bothering with it for now because the tree is quite
     * small and this optimization isn't a priority right now.
     * 
     * @param {Object} node 
     * @param {String} id 
     * @returns 
     */
    findTreeById (node, id) {
        if (node.id === id) {
            return node;
        }
        if (node.children && node.children.length > 0) {
            for (const child of node.children) {
                const foundNode = this.findTreeById(child, id);
                if (foundNode) {
                    return foundNode;
                }
            }
        }

        return null;
    };
};