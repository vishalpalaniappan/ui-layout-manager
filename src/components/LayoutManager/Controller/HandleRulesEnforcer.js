import TRANSFORMATION_TYPES from "./TRANSFORMATION_TYPES";
/**
 * This class generates transformations based on the handle
 * bars movements. It sets up thresholds at which it collapses
 * and expands the containers. This isn't the width of the container,
 * it is the position of the handle bar in the parent container. So
 * even if a container has a min width of 200px, when the handle bar
 * reaches 50px from the left, it will collapse it.
 * 
 * This will be expanded in the future to have different collapsed states.
 * So rather than fully collapsing the container, it sets up a 
 * minimum size, this willl be useful for accordians and other containers.
 */
export class HandleRulesEnforcer {
    /**
     * Initialize the child rule enforcer.
     * @param {Object} parent
     * @param {Object} sibling1
     * @param {Object} sibling2
     * @param {Object} handleMetadata
     */
    constructor (parent, sibling1, sibling2, handleMetadata) {
        this.parent = parent;
        this.type = null;
        this.args = {};
        this.sibling1 = sibling1;
        this.sibling2 = sibling2;
        this.handleMetadata = handleMetadata;
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
     * Evaluate the rules based on childs 
     */
    evaluate() {
        const props = this.getProps(this.parent);
        let args;
        if (props.dynamic === "width") {
            if (this.handleMetadata.handle.x < 100) {
                this.type = TRANSFORMATION_TYPES.UPDATE_SIZE;
                args = {style: {"display":"none"}}
                const prop = "min-" + props["dynamic"];
                args.style[prop] = 0;
                this.sibling1.hidden = true;
            } else if (this.handleMetadata.handle.x > 100 && this.sibling1.hidden) {
                this.type = TRANSFORMATION_TYPES.UPDATE_SIZE;
                args = {style: {"display":"flex"}}
                if ("size" in this.sibling1 && "min" in this.sibling1.size) {
                    const prop = "min-" + props["dynamic"];
                    args.style[prop] = this.sibling1.size.min.value + this.sibling1.size.min.unit;
                }
                this.sibling1.hidden = false;
            }
        }
        Object.assign(this.args, args);
    }
}