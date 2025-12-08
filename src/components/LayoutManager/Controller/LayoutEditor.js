import LAYOUT_WORKER_PROTOCOL from "./LAYOUT_WORKER_PROTOCOL";
import TRANSFORMATION_TYPES from "./TRANSFORMATION_TYPES";

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
            childContainer.collapsed = false;
            this.transformations.push(
                {
                    id: childContainer.id, 
                    type: TRANSFORMATION_TYPES.UPDATE_SIZE,
                    args: {
                        size: childSize,
                        orientation: node.orientation
                    }
                }
            );
            this.initializeNode(childContainer);
        }
    }

    /**
     * Use the given sizes to perform layout calculations and generate
     * transformations.
     * @param {Object} sizes 
     */
    applySizes(sizes) {        
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
        
        const parentSize = this.sizes[containerId];

        for (const child of node.children) {
            if (child.hasOwnProperty("collapse")) {                   
                const childContainer = this.ldf.containers[child.containerId];

                let type, args;
                if (parentSize[props["dynamic"]] <= child.collapse.value && child.collapse.condition === "lessThan") { 
                    // Collapse below threshold
                    if (!child.hidden) {
                        type = TRANSFORMATION_TYPES.UPDATE_SIZE;
                        args = {
                            size: {"display":"none"},
                            orientation: node.orientation
                        }
                        child.hidden = true;
                    }
                } else {          
                    // Expand above threshold
                    if (child.hidden) {
                        type = TRANSFORMATION_TYPES.UPDATE_SIZE;
                        args = {
                            size: {"display":"flex"},
                            orientation: node.orientation
                        }
                        child.hidden = false;
                    }
                }
                
                // Apply the transformation if it was calculated.
                if (type) {
                    this.transformations.push(
                        {
                            id: childContainer.id,
                            type: type,
                            args: args
                        }
                    );
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