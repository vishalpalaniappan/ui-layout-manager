/**
 * Given a file tree, it flattens the tree into a list of nodes with the level of each node in the tree.
 * 
 * @param {Array} tree - The file tree to flatten.
 * @param {number} level - The current level of the tree (used for indentation).
 * @return {Array} - The flattened tree with level information.
 */
export const flattenTree = (tree, level = 0) => {
    if (!level) {
        level = 0;
    }
    let rows = [];
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        node.level = level;
        rows.push(node);
        if (node?.children) {
            rows = rows.concat(flattenTree(node.children, level + 1));
        }
    }
    return rows;
}