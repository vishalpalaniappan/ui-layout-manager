
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
        const activeParent = drop.activeData.parentId;
        const overParent = drop.overData.parentId;

        // TODO: This is a temporary solution while I switch to event based arch.
        if (activeType === "EditorTab" && overType === "EditorTabGutter") {
            if (activeParent === overParent) {
                // Moving within same editor
                if (overParent === parentIdRef.current) {
                    editorRef.current.moveTab(drop.activeData.node.uid, drop.overData.index);
                }
            } else  {
                // Moving between editors, need to remove the tab that was moved
                if (overParent === parentIdRef.current) {
                    editorRef.current.addTab(drop.activeData.node, drop.overData.index);
                } else if (activeParent === parentIdRef.current) {
                    editorRef.current.closeTab(drop.activeData.node.uid);
                }
            }
        } else if (activeType === "FileTreeNode" && overType === "EditorTabGutter" && overParent === parentIdRef.current) {
            // Moving from fileTree to editor
            editorRef.current.addTab(drop.activeData.node, drop.overData.index);
        }
    }, [drop]);

    useLayoutEffect(() => {
        editorRef.current.setTabGroupId(parentIdRef.current);
        const files = [];
        flattenTree(fileTree.tree).forEach((node) => {
            if (node.type === "file") {
                files.push(node);
            }
        });

        for (let i = 0; i < 4; i++) {
            editorRef.current.addTab(files[Math.floor(Math.random() * 3) + 1]);
        }
    }, []);

    return (
        <Editor ref={editorRef} />  
    );
};

export default FileEditor;