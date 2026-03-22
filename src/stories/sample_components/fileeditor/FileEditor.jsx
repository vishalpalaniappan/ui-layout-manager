
import { useRef, useLayoutEffect, useEffect } from "react";
import { Editor } from 'sample-ui-component-library';
import fileTree from "./workspace_sample.json";

import { useDragState } from "../../../components/LayoutManager/Providers/DragProvider";

import { flattenTree } from "./helper";



const FileEditor = () => {
    const editorRef = useRef(null);
    const parentIdRef = useRef(null);

    const { drop } = useDragState();
    useEffect(() => {
        if (!drop?.overId) {
            return;
        }
        
        const activeType = drop.activeData.type;
        const overType = drop.overData.type;
        const activeParent = drop.activeData.parentId;
        const overParent = drop.overData.parentId;

        // Only drop files, not folders.
        if (drop.activeData.node.type !== "file") {
            return;
        }

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

    useEffect(() => {
        parentIdRef.current = crypto.randomUUID();
        editorRef.current.setTabGroupId(parentIdRef.current);

        // This is only for demo purposes, I am randomly loading 2 files.
        const files = flattenTree(fileTree.tree).filter((node) => node.type === "file");
        for (let i = 0; i < 4; i++) {
            editorRef.current.addTab(files[Math.floor(Math.random() * 2) + 1]);
        }
    }, []);

    return (
        <Editor ref={editorRef} />  
    );
};

export default FileEditor;