export class LayoutEditor {

    constructor (ldf) {
        this.ldf = ldf;
        console.log("Created modifier with ", this.ldf);
    }

    processTree (id, width, height) {
        const rootNode = this.findTreeById(this.ldf.layout, id);
        console.log(rootNode);
    }


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