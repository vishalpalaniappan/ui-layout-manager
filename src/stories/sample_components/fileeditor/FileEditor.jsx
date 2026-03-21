
import { useRef, useLayoutEffect, useEffect } from "react";
import { Editor } from 'sample-ui-component-library';
import fileTree from "./workspace_sample.json";

import { useDragState } from "../../../components/LayoutManager/Providers/DragProvider";

const flattenTree = (tree, level = 0) =>
  tree.flatMap(node => [
    { ...node, level },
    ...(node.children ? flattenTree(node.children, level + 1) : [])
]);


const FileEditor = () => {
    const editorRef = useRef(null);

    const { drop } = useDragState();

    useEffect(() => {
        console.log("Dropped:", drop);
        if (drop?.overId) {
            if (drop.activeData.type === "EditorTab" && drop.overData.type === "EditorTabGutter") {
                editorRef.current.moveTab(drop.activeData.node.uid, drop.overData.index);
            } else {
                editorRef.current.addTab(drop.activeData.node);
            }
        }
    }, [drop]);

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