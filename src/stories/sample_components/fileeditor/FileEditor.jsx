
import { useRef, useLayoutEffect } from "react";
import { Editor } from 'sample-ui-component-library';
import fileTree from "./workspace_sample.json"

const flattenTree = (tree, level = 0) =>
  tree.flatMap(node => [
    { ...node, level },
    ...(node.children ? flattenTree(node.children, level + 1) : [])
]);


const FileEditor = () => {
    const editorRef = useRef(null);

    useLayoutEffect(() => {
        editorRef.current.setTabGroupId("tab-group-1");
        flattenTree(fileTree.tree).forEach((node, index) => {
            if (node.type === "file") {
                editorRef.current.addTab(node);
            }
        });
    }, []);

    return (
        <Editor  ref={editorRef} />  
    );
};

export default FileEditor;