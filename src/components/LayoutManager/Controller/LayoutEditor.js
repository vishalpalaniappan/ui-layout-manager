export class LayoutEditor {

    /**
     * Initializes the editor with the given ldf file.
     * @param {Object} ldf 
     */
    constructor (ldf) {
        this.ldf = ldf;
        console.log("Created modifier with ", this.ldf);
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

        console.log(width, height);
        const node = this.findTreeById(this.ldf.layout, parentId);

        if (!("children" in node) || node.children.length == 0) {
            return null;
        }

        const size = {
            width: width,
            height: height
        }

        let parentSize, fixedProp, dynamicProp;
        if (node.childType === "row") {
            dynamicProp = "height";
            fixedProp = "width";
            parentSize = size.height;
        } else if (node.childType === "column") {
            dynamicProp = "width";
            fixedProp = "height";
            parentSize = size.width;
        }

        node.children.forEach((child,index) => {
            let style = {};
            style[fixedProp] = size[fixedProp];
            this.sendTransformation(parentId, child.id, "style", fixedProp, style[fixedProp]);
            let renderHandle;

            switch(child.type) {
                case "px":
                    style[dynamicProp] = child[dynamicProp];
                    this.sendTransformation(parentId, child.id, "style", dynamicProp, child[dynamicProp]+ "px");
                    renderHandle = (index < node.children.length - 1);
                    break;
                case "percent":
                    const sizeInPx = (child[dynamicProp]/100) * parentSize;
                    style[dynamicProp] = sizeInPx;
                    this.sendTransformation(parentId, child.id, "style", dynamicProp, sizeInPx + "px");
                    renderHandle = (index < node.children.length - 1);
                    break;
                case "fixed":
                    style[dynamicProp] = child[dynamicProp];
                    this.sendTransformation(parentId, child.id, "style", dynamicProp, child[dynamicProp] + "px");
                    renderHandle = false;
                    break;
                case "fill":
                    style.flexGrow = 1;
                    style[dynamicProp] = (node.childType === "row")?height:width;
                    this.sendTransformation(parentId, child.id, "style", "flexGrow", 1);
                    renderHandle = false;
                    break;
                default:
                    console.error("Child layout type is invalid!")
                    break;
            }

            if ("background" in child) {
                style["background"] = child.background;
                this.sendTransformation(parentId, child.id, "style", "background", child.background);
            } 

            if ("children" in child) {
                this.processSubTree(child.id, style.width, style.height);
            }

        });

    };

    /**
     * Passes a DOM transformation to the main thread.
     * @param {String} parentId - ID of the parent node in the layout tree.
     * @param {String} id - ID of node in the layout tree.
     * @param {String} type - Type of transofrmation (ex. style)
     * @param {String} key - Key of transformation (ex. width, height)
     * @param {String|Number} value - Value of transformation (ex. 123, "#444444")
     */
    sendTransformation (parentId, id, type, key, value) {
        postMessage({
            parentId: parentId,
            id: id,
            type: type,
            key: key,
            value: value
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