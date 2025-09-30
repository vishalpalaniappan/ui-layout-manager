import React, { useEffect, useLayoutEffect, useState, useRef, createContext, useContext } from "react";
import PropTypes from 'prop-types';
import { Container } from "../Container/Container";
import { useLayoutController } from "../../Providers/LayoutProvider";

import "./RootContainer.scss"
/**
 * Root node for the layout tree. This component will start 
 * rendering the tree and it will also watch for changes in the
 * root container sizes to process layout changes.
 * 
 * @return {React.ReactElement}
 */
export const RootContainer = () => {
    const controller = useLayoutController();

    const rootRef = useRef(null);
    const timerRef = useRef(null);
    
    const [rootNode, setRootNode] = useState(null);
    const [resizing, setResizing] = useState(false);
    
    // Create the container API that will be used by the controller.
    const rootContainerAPI = useRef({});
    rootContainerAPI.current = {};

    useLayoutEffect(() => {
        if (controller) {
            setRootNode(controller.ldf.containers[controller.ldf.layoutRoot]);

            controller.registerContainer("root", rootContainerAPI, rootRef.current);

            const observer = new ResizeObserver((entries) => {

                if (!resizing) setResizing(true);   
                             
                for (let entry of entries) {
                    const { width, height } = entry.contentRect;

                    clearTimeout(timerRef.current);

                    timerRef.current = setTimeout(() => {
                        setResizing(false);
                    }, 200);

                }
            });

            observer.observe(rootRef.current);

            return () => {
                controller.unregisterContainer("root");
                observer.disconnect();
            }
        }
    }, [controller]);

    return (
        <div ref={rootRef} className="background">
            {
                rootNode && 
                <Container node={rootNode} meta={controller.ldf.layoutRoot} id={rootNode.id}/>
            }
        </div>
    );
}