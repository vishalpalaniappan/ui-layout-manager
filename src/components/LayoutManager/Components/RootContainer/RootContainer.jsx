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
    const resizingRef = useRef(false);

    const [rootNode, setRootNode] = useState(null);
    
    // Create the container API that will be used by the controller.
    const rootContainerAPI = useRef({});
    rootContainerAPI.current = {};

    /**
     * Invokes function in controller to handle root size changes.
     * @param {Number} width 
     * @param {Number} height 
     */
    const updateRootSize = (width, height) => {    
        controller.handleRootResize(width, height);
    };

    useLayoutEffect(() => {
        if (controller) {
            setRootNode(controller.ldf.containers[controller.ldf.layoutRoot]);

            controller.registerContainer("root", rootContainerAPI, rootRef.current);

            // Create resize observer to monitor changes in the root container size.
            const observer = new ResizeObserver((entries) => {

                if (!resizingRef.current) resizingRef.current = true;

                for (let entry of entries) {
                    const { width, height } = entry.contentRect;

                    clearTimeout(timerRef.current);

                    timerRef.current = setTimeout(() => {
                        resizingRef.current = false;
                        updateRootSize(width, height);
                    }, 1);
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