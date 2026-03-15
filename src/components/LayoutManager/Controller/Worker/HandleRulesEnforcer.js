import TRANSFORMATION_TYPES from "../TRANSFORMATION_TYPES";
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
        this.activeSibling = null;
        const props = this.getProps(this.parent);
        if (props.dynamic === "width") {
            this.processVerticalContainers();
        } else if (props.dynamic === "height") {
            this.processHorizontalContainers();
        }
    }

    /**
     * Process the vertical containers.
     */
    processVerticalContainers () {
        const totalWidth = this.handleMetadata.sizes[this.parent.id].width;
        this.type = TRANSFORMATION_TYPES.UPDATE_SIZE;

        // Currently only collapse the edge containers
        // TODO: In the future add logic for middle containers (accordian style)
        if (!this.checkIfEdgeContainer()) {
            return;
        }
        
        if (this.handleMetadata.handle.x < 100) {
            this.args = {style: {"display":"none", "min-width":0}}
            this.sibling1.hidden = true;
            this.activeSibling = this.sibling1.id;
        } else if (this.handleMetadata.handle.x > 100 && this.sibling1.hidden) {
            this.args = {style: {"display":"flex"}}
            const sibling = this.getSiblingProps(this.sibling1.id);
            if ("min" in sibling.size) {
                this.args.style["min-width"] = sibling.size.min.value + sibling.size.min.unit;
            }
            this.sibling1.hidden = false;
            this.activeSibling = this.sibling1.id;
        } 
        
        
        if (this.handleMetadata.handle.x > totalWidth - 100) {
            this.args = {style: {"display":"none", "min-width":0}}
            this.sibling2.hidden = true;
            this.activeSibling = this.sibling2.id;
        } else if (this.handleMetadata.handle.x < totalWidth - 100 && this.sibling2.hidden) {
            this.args = {style: {"display":"flex"}}
            const sibling = this.getSiblingProps(this.sibling2.id);
            if ("min" in sibling.size) {
                this.args.style["min-width"] = sibling.size.min.value + sibling.size.min.unit;
            }
            this.sibling2.hidden = false;
            this.activeSibling = this.sibling2.id;
        }
    }


     /**
     * Process the horizontal containers.
     */
    processHorizontalContainers () {
        const totalHeight = this.handleMetadata.sizes[this.parent.id].height;
        this.type = TRANSFORMATION_TYPES.UPDATE_SIZE;

        // Currently only collapse the edge containers
        // TODO: In the future add logic for middle containers (accordian style)
        if (!this.checkIfEdgeContainer()) {
            return;
        }
        
        if (this.handleMetadata.handle.y < 100) {
            this.args = {style: {"display":"none", "min-height":0}}
            this.sibling1.hidden = true;
            this.activeSibling = this.sibling1.id;
        } else if (this.handleMetadata.handle.y > 100 && this.sibling1.hidden) {
            this.args = {style: {"display":"flex"}}
            const sibling = this.getSiblingProps(this.sibling1.id);
            if ("min" in sibling.size) {
                this.args.style["min-height"] = sibling.size.min.value + sibling.size.min.unit;
            }
            this.sibling1.hidden = false;
            this.activeSibling = this.sibling1.id;
        } 
        
        
        if (this.handleMetadata.handle.y > totalHeight - 100) {
            this.args = {style: {"display":"none", "min-height":0}}
            this.sibling2.hidden = true;
            this.activeSibling = this.sibling2.id;
        } else if (this.handleMetadata.handle.y < totalHeight - 100 && this.sibling2.hidden) {
            this.args = {style: {"display":"flex"}}
            const sibling = this.getSiblingProps(this.sibling2.id);
            if ("min" in sibling.size) {
                this.args.style["min-height"] = sibling.size.min.value + sibling.size.min.unit;
            }
            this.sibling2.hidden = false;
            this.activeSibling = this.sibling2.id;
        }
    }

    /**
     * Given the sibling ID, it returns the child properties from the parent.
     * This includes the min-size and max-size. This is done because the actual
     * min and max sizes are saved in the children of the parent, not in the actual
     * container itself in the LDF file. 
     * @param {String} siblingId 
     */
    getSiblingProps (siblingId) {
        for (let i = 0; i < this.parent.children.length; i++) {
            const child = this.parent.children[i];
            if (child.containerId ===  siblingId) {
                return child;
            }
        }
    }


    /**
     * Check if the handle bar is attached to the edge of the parent container.
     * i.e. Is sibling1 on the very left or is sibling2 on the very right.
     */
    checkIfEdgeContainer () {
        const firstSibling = this.parent.children[0];
        const lastSibling = this.parent.children[this.parent.children.length -1];

        if (firstSibling.containerId === this.sibling1.id) {
            return true;
        } else if (lastSibling.containerId === this.sibling2.id) {
            return true;
        }

        return false;
    }
}