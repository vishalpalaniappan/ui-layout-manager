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
            let fixedSizeSum = 0;
            let remainingSize = (node.orientation === "horizontal") ? size.width : size.height;
            
            for (const child of node.children) {
                console.log("Child ID:", child.containerId);
                console.log("Child size:", child.size.initial);

                // Calculate the fixed size sum and remaining size.
                if (child.size.initial.type === "fixed") {
                    const fixedValue = child.size.initial.value;
                    fixedSizeSum += fixedValue;
                    remainingSize -= fixedValue;
                }               
            }

            console.log("Fixed size sum:", fixedSizeSum);
            console.log("Remaining size for fill:", remainingSize);
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