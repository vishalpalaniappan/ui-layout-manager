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
        const node = this.findTreeById(this.ldf.layout, parentId);

        if (!("children" in node) || node.children.length == 0) {
            return null;
        }

        let parentSize, fixedProp, dynamicProp;
        if (node.childType === "row") {
            dynamicProp = "height";
            fixedProp = "width";
            parentSize = height;
        } else if (node.childType === "column") {
            dynamicProp = "width";
            fixedProp = "height";
            parentSize = width;
        }

        node.children.forEach((child,index) => {
            let style = {};
            style[fixedProp] = "100%";
            let renderHandle;

            switch(child.type) {
                case "px":
                    style[dynamicProp] = child[dynamicProp];
                    renderHandle = (index < node.children.length - 1);
                    break;
                case "percent":
                    const sizeInPx = (child[dynamicProp]/100) * parentSize;
                    style[dynamicProp] = sizeInPx;
                    renderHandle = (index < node.children.length - 1);
                    break;
                case "fixed":
                    style[dynamicProp] = child[dynamicProp];
                    renderHandle = false;
                    break;
                case "fill":
                    style.flexGrow = 1;
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

            this.processSubTree(child.id, style["width"], style["height"]);
        });

    };

    sendTransformation (parentId, id, type, key, value) {
        postMessage({
            parentId: id,
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