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

        if (isSplit) {
            // If the node is a split, we need to apply transformations to its children.
            for (const child of node.children) {
                console.log("Child ID:", child.containerId);
                console.log("Child size:", child.size);

                //Calculate Child Size based on parent size and child size type
                
                let childSize = { width: 0, height: 0 };
                this.processNode(child.containerId, childSize);
            }
        }
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