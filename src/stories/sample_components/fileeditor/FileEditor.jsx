
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
    const parentIdRef = useRef(null);

    const { drop } = useDragState();

    useEffect(() => {
        parentIdRef.current = crypto.randomUUID();
    }, []);

    useEffect(() => {
        if (!drop?.overId) {
            return;
        }
        
        const activeType = drop.activeData.type;
        const overType = drop.overData.type;
        const parentId = drop.overData.parentId;

        console.log(drop.activeData, drop.overData);

        if (activeType === "EditorTab" && overType === "EditorTabGutter") {
            if (drop.overData.index === parentIdRef.current) {
                editorRef.current.moveTab(drop.activeData.node.uid, drop.overData.index);
            } else {
                editorRef.current.addTab(drop.activeData.node, drop.overData.index);
            }
        } else if (activeType === "FileTreeNode" && overType === "EditorTabGutter" && parentId === parentIdRef.current) {
            editorRef.current.addTab(drop.activeData.node, drop.overData.index);
        }
    }, [drop]);

    useLayoutEffect(() => {
        editorRef.current.setTabGroupId(parentIdRef.current);
        flattenTree(fileTree.tree).forEach((node) => {
            if (node.type === "file") {
                editorRef.current.addTab(node);
            }
        });
    }, []);

    return (
        <Editor ref={editorRef} />  
    );
};

export default FileEditor;