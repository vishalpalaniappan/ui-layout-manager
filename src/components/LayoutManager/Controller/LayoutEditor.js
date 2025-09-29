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
        const isSplit = node.type ? node.type === "split": false;

        // If the node has no children, then it is a leaf node, so we return.
        if (!isSplit) {
            console.info("Node is a leaf, no children to process.");
            return;
        }


        // Identify the dynamic property based on orientation.
        let props = {};
        if (node.orientation === "horizontal") {
            props = {"dynamic": "width", "fixed": "height"};
        } else if (node.orientation === "vertical") {
            props = {"dynamic": "height", "fixed": "width"};
        } else {
            console.warn("Unknown orientation:", node.orientation);
            //TODO: Decide how to handle invalid ldf configuration.
        }
        
        // Calculate the fixed size sum and the remaining size for fill types.
        let remainingSize = (node.orientation === "horizontal") ? size.width : size.height;
        let fillCount = 0;
        for (const child of node.children) {
            switch(child.size.initial.type) {
                case "fixed":
                    remainingSize -= child.size.initial.value;
                    break;
                case "fill":
                    fillCount += 1;
                    break;
                default:
                    console.warn("Unknown size type:", child.size.initial.type);
                    //TODO: Decide how to handle invalid ldf configuration.
            }
        }

        // Calculate child sizes.
        for (const child of node.children) {
            let childSize = {};
            switch(child.size.initial.type) {
                case "fixed":
                    childSize[props["dynamic"]] = child.size.initial.value;
                    childSize[props["fixed"]] = size[props["fixed"]];
                    break;
                case "fill":
                    childSize[props["dynamic"]] = remainingSize / fillCount;
                    childSize[props["fixed"]] = size[props["fixed"]];
                    break;
                default:
                    console.warn("Unknown size type:", child.size.initial.type);
            }
            //Save the current size in LDF for future reference.
            child.size.current = childSize;
        }

        // Apply transformations to children and recurse.
        for (const child of node.children) {
            const childId = this.ldf.containers[child.containerId].id;
            this.transformations.push({
                id: childId,
                size: child.size.current
            });
            this.processNode(this.ldf.containers[child.containerId], child.size.current);
        }
    }


    /**
     * Passes a DOM transformation to the main thread.
     */
    sendTransformations () {
        postMessage({
            type: "transformations",
            data: this.transformations
        });
        this.transformations = []
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