// @ts-nocheck
import { useRef, useLayoutEffect } from "react";
import { FileBrowser } from 'sample-ui-component-library';
import tree from "./workspace_sample.json"

import { useLayoutEventPublisher } from "../../../components/LayoutManager/Providers/LayoutEventProvider";
import { useModalManager } from "../../../components/LayoutManager/Providers/ModalProvider";
import Stack from "../stack/Stack";

const FileTree = () => {
    const fileBrowserRef = useRef(null);
    const publish = useLayoutEventPublisher();
    const { openModal } = useModalManager();

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

        if (node.name === "readme") {
            const {id, close} = openModal({args:{
                title:"Readme",
                render: ({ close }) => {
                    return <Stack />;
                }
            }});

            setTimeout(() => {
                close();
            }, 2000);
        }
    }

    return (
        <FileBrowser ref={fileBrowserRef} onSelectFile={onSelectFile} />  
    );
};

export default FileTree;