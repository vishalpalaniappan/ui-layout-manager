// @ts-nocheck
import { useRef, useLayoutEffect } from "react";
import { FileBrowser } from 'sample-ui-component-library';
import tree from "./workspace_sample.json"

import { useLayoutPublisher } from "../../../components/LayoutManager/Providers/LayoutEventProvider";

const FileTree = () => {
    const fileBrowserRef = useRef(null);
    const publish = useLayoutPublisher();

    useLayoutEffect(() => {
        fileBrowserRef.current.addFileTree(tree.tree);
        // setTimeout(() => {
        //     fileBrowserRef.current.selectNode("dir-f6459410-1634-4dbc-8d76-35896822158d");
        // }, 3000);
    }, []);

    const onSelectFile = (node) => {
        publish({
          type: "file:selected",
          payload: node,
          source: "file-tree",
        })
    }

    return (
        <FileBrowser ref={fileBrowserRef} onSelectFile={onSelectFile} />  
    );
};

export default FileTree;