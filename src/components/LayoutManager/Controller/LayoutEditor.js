export class LayoutEditor {

    /**
     * Initializes the editor with the given ldf file.
     * @param {Object} ldf 
     */
    constructor (ldf) {
        this.ldf = ldf;
        console.log("Created modifier with ", this.ldf);
    }

    /**
     * Given an id with initial size, this function finds the
     * node in the tree and then processes its subtree recursively
     * and calculates the new sizes based on the initial size.
     * @param {String} id 
     * @param {Number} width 
     * @param {Number} height 
     */
    processTree (id, width, height) {
        const rootNode = this.findTreeById(this.ldf.layout, id);
        console.log(rootNode);
    }


    /**
     * Recursively processes tree to find the provided node.
     * 
     * TODO: This can be optimized if instead of the id, the 
     * full access key path is provided to get the node directly.
     * I am not bothering with it for now because the tree is quite
     * small and this optimization isn't a priority right now.
     * 
     * @param {Object} node 
     * @param {String} id 
     * @returns 
     */
    findTreeById (node, id) {
        if (node.id === id) {
            return node;
        }
        if (node.children && node.children.length > 0) {
            for (const child of node.children) {
                const foundNode = this.findTreeById(child, id);
                if (foundNode) {
                    return foundNode;
                }
            }
        }

        return null;
    }
}