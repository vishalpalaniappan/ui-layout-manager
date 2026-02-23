import LAYOUT_WORKER_PROTOCOL from "./LAYOUT_WORKER_PROTOCOL";
import TRANSFORMATION_TYPES from "./TRANSFORMATION_TYPES";
import { ParentRuleEnforcer } from "./ParentRuleEnforcer";
import { HandleRulesEnforcer } from "./HandleRulesEnforcer";

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
     * Get props given node orientation.
     * @param {Object} node 
     */
    getProps(node) {
        // Identify the dynamic property based on orientation.
        if (node.orientation === "horizontal") {
            return {"dynamic": "width", "fixed": "height"};
        } else if (node.orientation === "vertical") {
            return {"dynamic": "height", "fixed": "width"};
        } else {
            throw new Error(`Unknown orientation "${node.orientation}" in LDF configuration`);
        }  
    }

    /**
     * Processes the node and applies the initial flex box styles. It recursively
     * calls the initialization function on the nodes children until the entire
     * layout is initialized.
     * 
     * After initialization, the layout is recalculated when the handle bar moves
     * or when the window is resized. In the future, I will add programatic control
     * to modify the layout. This means that the API will ask to divide a container
     * in two or to delete container.
     * 
     * TODO: Implement the programmatic control of layout containers (see above).
     * 
     * @param {Object} node Node to process.
     */
    initializeNode (node) {
        const isSplit = node.type ? node.type === "split": false;

        // If node is not split, then it has no children and is a leaf node, so we return.
        if (!isSplit) {
            return;
        }

        const props = this.getProps(node);
        
        for (const child of node.children) {
            if (child.type === "container") {
                let childStyle = {};
                switch(child.size.initial.type) {
                    case "fixed":
                        childStyle[props["dynamic"]] = child.size.initial.value + "px" ;                    
                        childStyle["flex"] = "0 0 auto";
                        break;
                    case "fill":
                        childStyle["flexGrow"] = 1;
                        break;
                    default:
                        throw new Error(`Unknown size type "${child.size.initial.type}" in LDF configuration`);
                }

                if ("min" in child.size) {
                    childStyle["min-" + props["dynamic"]] = child.size.min.value + "px"  ;
                }

                if ("max" in child.size) {
                    childStyle["max-" + props["dynamic"]] = child.size.max.value + "px" ;
                }

                const childContainer = this.ldf.containers[child.containerId];
                childContainer.collapsed = false;
                this.transformations.push(
                    {
                        id: childContainer.id, 
                        type: TRANSFORMATION_TYPES.UPDATE_SIZE,
                        args: {style: childStyle}
                    }
                );
                this.initializeNode(childContainer);
            }
        }
    }

    /**
     * Use the given sizes to perform layout calculations and generate
     * transformations.
     * @param {Object} sizes 
     */
    applySizes(sizes) {        
        this.sizes = sizes; 
        this.applyLayoutToNode(this.ldf.layoutRoot);        
        postMessage({
            type: LAYOUT_WORKER_PROTOCOL.TRANSFORMATIONS,
            data: this.transformations
        });
        this.transformations = []
    }

    /**
     * This function moves the handlebar.
     * @param {Object} metadata 
     */
    moveHandleBar(metadata) {
        const parent = this.ldf.containers[metadata.parent];
        const sibling1 = this.ldf.containers[metadata.sibling1];
        const sibling2 = this.ldf.containers[metadata.sibling2];
        const enforcer = new HandleRulesEnforcer(parent, sibling1, sibling2, metadata);
        enforcer.evaluate();

        if (enforcer.activeSibling !== null) {
            this.transformations.push(
                {
                    id: enforcer.activeSibling, 
                    type: TRANSFORMATION_TYPES.UPDATE_SIZE,
                    args: enforcer.args
                }
            );   
            postMessage({
                type: LAYOUT_WORKER_PROTOCOL.TRANSFORMATIONS,
                data: this.transformations
            });
            this.transformations = []
        }
    }

    /**
     * Applys the layout logic to the node with the given container id. 
     * @param {String} containerId 
     * @returns 
     */
    applyLayoutToNode(containerId) {
        const parent = this.ldf.containers[containerId];        

        // If node is not split, then it has no children and is a leaf node, so we return.
        if ((!parent.type ? parent.type === "split": false) || (!("children" in parent))) {
            return;
        }

        if (!this.sizes[containerId]) {
            console.warn(`Parent size not found for node ${parent.id}. Skipping collapse checks.`);
            return;
        }

        for (const child of parent.children) {
            if (child.type === "container") {
                const enforcer = new ParentRuleEnforcer(this.sizes, parent, child);
                enforcer.evaluate();
                if (enforcer.type) {
                    this.transformations.push(
                        {
                            id: this.ldf.containers[child.containerId].id,
                            type: enforcer.type,
                            args: enforcer.args,
                        }
                    );
                }
                this.applyLayoutToNode(child.containerId);
            }
        }
    }
};