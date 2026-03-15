import TRANSFORMATION_TYPES from "../TRANSFORMATION_TYPES";
/**
 * This class generates transformations based on the
 * parents layout configuration. For example, it collapses
 * a container if the parent size reaches a threshold
 * or expands it if the is above a threshold.
 */
export class ParentRuleEnforcer {
    /**
     * Initialize the rule enforcer.
     * @param {Object} sizes 
     * @param {Object} parent 
     * @param {Object} child 
     */
    constructor (sizes, parent, child) {
        this.sizes = sizes;
        this.parent = parent;
        this.child = child;
        this.type = null;
        this.args = {};
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
     * Evaluate the rules based on parent and child sizes and
     * the specified layout configuration.
     */
    evaluate() {
        if (this.child.hasOwnProperty("collapse") && this.child["collapse"]["relative"] === "parent") { 
            this.evaluateCollapseByParent();
        }
    }

    /**
     * Evaluate the collapse by parent property.
     */
    evaluateCollapseByParent() {
        const props = this.getProps(this.parent);
        const parentSize = this.sizes[this.parent.id];

        let args = {};
        if (parentSize[props["dynamic"]] <= this.child.collapse.value && this.child.collapse.condition === "lessThan") { 
            // Collapse below threshold
            if (!this.child.hidden) {
                this.type = TRANSFORMATION_TYPES.UPDATE_SIZE;
                args = {style: {"display":"none"}}
                const prop = "min-" + props["dynamic"];
                args.style[prop] = 0;
                this.child.hidden = true;
            }
        } else {          
            // Expand above threshold
            if (this.child.hidden) {
                this.type = TRANSFORMATION_TYPES.UPDATE_SIZE;
                args = {style: {"display":"flex"}}
                if ("min" in this.child.size) {
                    const prop = "min-" + props["dynamic"];
                    args.style[prop] = this.child.size.min.value + this.child.size.min.unit;
                }
                this.child.hidden = false;
            }
        }
        Object.assign(this.args, args);
    }
}