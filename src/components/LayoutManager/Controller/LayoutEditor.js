import LAYOUT_WORKER_PROTOCOL from "./LAYOUT_WORKER_PROTOCOL";

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
     * Initializes flexbox layout by processing LDF file.
     */
    initializeFlexBox() {
        this.initializeNode(this.ldf.containers[this.ldf.layoutRoot]);        
        postMessage({
            type: LAYOUT_WORKER_PROTOCOL.INITIALIZE_FLEXBOX,
            data: this.transformations
        });
        this.transformations = []
    }

    /**
     * Processes the container with the given id and dimensions. It recursively
     * traverses the layout tree to find the node and applies transformations to
     * all its children.
     * 
     * @param {Object} node Node to process.
     */
    initializeNode (node) {
        const isSplit = node.type ? node.type === "split": false;

        // If node is not split, then it has no children and is a leaf node, so we return.
        if (!isSplit) {
            return;
        }

        // Identify the dynamic property based on orientation.
        let props = {};
        if (node.orientation === "horizontal") {
            props = {"dynamic": "width", "fixed": "height"};
        } else if (node.orientation === "vertical") {
            props = {"dynamic": "height", "fixed": "width"};
        } else {
            throw new Error(`Unknown orientation "${node.orientation}" in LDF configuration`);
        }
        
        for (const child of node.children) {
            let childSize = {};
            switch(child.size.initial.type) {
                case "fixed":
                    childSize[props["dynamic"]] = child.size.initial.value + "px" ;                    
                    childSize["flex"] = "0 0 auto";
                    break;
                case "fill":
                    childSize["flexGrow"] = 1;
                    break;
                default:
                    throw new Error(`Unknown size type "${child.size.initial.type}" in LDF configuration`);
            }
            const childContainer = this.ldf.containers[child.containerId];
            this.transformations.push({id: childContainer.id, size: childSize});
            this.initializeNode(childContainer);
        }
    }

    /**
     * Use the given sizes to perform layout calculations and generate
     * transformations.
     * @param {Object} sizes 
     */
    applySizes(sizes) {        
        console.log("Applying sizes:", sizes);
        this.sizes = sizes; 
        this.layoutNode(this.ldf.layoutRoot);        
        postMessage({
            type: LAYOUT_WORKER_PROTOCOL.TRANSFORMATIONS,
            data: this.transformations
        });
        this.transformations = []
    }

    /**
     * Applys the layout logic to the node with the given container id. 
     * 
     * TODO: Container id is not the same as node id. Container id is the 
     * key used in the LDF file to identify the container. This is confusing,
     * I am going to fix it.
     * @param {String} containerId 
     * @returns 
     */
    layoutNode(containerId) {
        const node = this.ldf.containers[containerId];        
        const isSplit = node.type ? node.type === "split": false;

        // If node is not split, then it has no children and is a leaf node, so we return.
        if (!isSplit) {
            return;
        }

        // Identify the dynamic property based on orientation.
        let props = {};
        if (node.orientation === "horizontal") {
            props = {"dynamic": "width", "fixed": "height"};
        } else if (node.orientation === "vertical") {
            props = {"dynamic": "height", "fixed": "width"};
        } else {
            throw new Error(`Unknown orientation "${node.orientation}" in LDF configuration`);
        }

        const parentSize = this.sizes[node.id];

        for (const child of node.children) {
            if (child.hasOwnProperty("collapse")) {
                if (parentSize[props["dynamic"]] <= child.collapse.value && child.collapse.condition === "lessThan") {                    
                    const childContainer = this.ldf.containers[child.containerId];
                    let transformation = {"display":"none"};
                    this.transformations.push({id: childContainer.id, size: transformation});
                } else {                                   
                    const childContainer = this.ldf.containers[child.containerId];
                    let transformation = {"display":"flex"};
                    this.transformations.push({id: childContainer.id, size: transformation});
                }
            }
            this.layoutNode(child.containerId);
        }
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