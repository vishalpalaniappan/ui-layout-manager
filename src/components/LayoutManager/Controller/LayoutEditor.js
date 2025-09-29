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

    /**
     * Processes the node with the given id and dimensions. It recursively
     * traverses the layout tree to find the node and applies transformations to
     * all its children.
     * 
     * @param {Object} node Node to process.
     * @param {Object} size Object containing width and height of the node.
     */
    processNode (node, size) {
        console.log("");
        console.log("Processing node", node, "with dimensions", size.width, size.height);

        const isSplit = node.type ? node.type === "split": false;

        // If the node is a split, we need to apply transformations to its children.
        if (isSplit) {

            // Identify the dynamic property based on orientation.
            let dynamicProp;
            let fixedProp;
            if (node.orientation === "horizontal") {
                dynamicProp = "width";
                fixedProp = "height";
            } else if (node.orientation === "vertical") {
                dynamicProp = "height";
                fixedProp = "width";
            } else {
                console.warn("Unknown orientation:", node.orientation);
                return;
            }
            
            // Calculate the fixed size sum and the remaining size for fill types.
            let fixedSizeSum = 0;
            let fillCount = 0;
            let remainingSize = (node.orientation === "horizontal") ? size.width : size.height;
            for (const child of node.children) {
                switch(child.size.initial.type) {
                    case "fixed":
                        fixedSizeSum += child.size.initial.value;
                        remainingSize -= child.size.initial.value;
                        break;
                    case "fill":
                        fillCount += 1;
                        break;
                    default:
                        console.warn("Unknown size type:", child.size.initial.type);
                }
            }

            // Calculate child sizes.
            for (const child of node.children) {
                let childSize = {};
                switch(child.size.initial.type) {
                    case "fixed":
                        childSize[dynamicProp] = child.size.initial.value;
                        childSize[fixedProp] = size[fixedProp];
                        break;
                    case "fill":
                        childSize[dynamicProp] = remainingSize / fillCount;
                        childSize[fixedProp] = size[fixedProp];
                        break;
                    default:
                        console.warn("Unknown size type:", child.size.initial.type);
                }
                console.log(childSize);
            }


            // Process each child node recursively.
        }
    }

    /**
     * 
     * @param {*} parentSize 
     * @param {*} childSizeDef 
     * @param {*} orientation 
     */
    calculateChildSize (parentSize, childSizeDef, orientation) {
        console.log("Calculating child size for parent size:", parentSize, "child size definition:", childSizeDef, "orientation:", orientation);
    }


    /**
     * Passes a DOM transformation to the main thread.
     * @param {Array} transformations - An array of transformations.
     */
    sendTransformations (transformations) {
        postMessage({
            type: "transformations",
            data: transformations
        })
    }


    /**
     * Find the provided node in the layout tree by its id.
     * 
     * TODO: If I use the id as the container key, I can access the 
     * node directly without traversing the list.
     * 
     * @param {String} id 
     * @returns 
     */
    getNodeUsingId (id) {
        for (const key in this.ldf.containers) {
            if (this.ldf.containers[key].id === id) {
                return this.ldf.containers[key];
            }
        }
        return null;
    };
};