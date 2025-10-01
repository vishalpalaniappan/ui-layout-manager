import React, { useEffect, useLayoutEffect, useState, useRef, useCallback, useContext } from "react";
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
    
    // Create the container API that will be used by the controller.
    const rootContainerAPI = useRef({});
    rootContainerAPI.current = {};

    const [childElements, setChildElements] = useState(null);
    
    /**
     * Renders child containers recursively.
     */
    const processContainer = useCallback((node) => {
        const childElements = [];      
        for (let index = 0; index < node.children.length; index++) {
            const child = controller.ldf.containers[node.children[index].containerId];
            childElements.push(
                <Container key={index} meta={node.children[index]} id={child.id} node={child}/>
            );
        };
        return childElements;
    },[controller]);


    useLayoutEffect(() => {
        if (controller) {            
            const rootNode = controller.ldf.containers[controller.ldf.layoutRoot];
            const hasChildren = rootNode.children && rootNode.children.length > 0
            controller.registerContainer(rootNode.id, rootContainerAPI, rootRef.current);

            if (hasChildren) {                          
                if (rootNode.orientation === "horizontal") {
                    rootRef.current.style.flexDirection = "row";
                } else if (rootNode.orientation === "vertical") {
                    rootRef.current.style.flexDirection = "column";
                }
            }

            setChildElements(hasChildren?processContainer(rootNode):null);

            // Create resize observer to monitor changes in the root container size.
            const observer = new ResizeObserver((entries) => {

                if (!resizingRef.current) resizingRef.current = true;

                for (let entry of entries) {
                    const { width, height } = entry.contentRect;

                    clearTimeout(timerRef.current);

                    timerRef.current = setTimeout(() => {
                        resizingRef.current = false;
                    }, 1);
                }
            });

            observer.observe(rootRef.current);

            return () => {
                controller.unregisterContainer(controller.ldf.layoutRoot);
                observer.disconnect();
            }
        }
    }, [controller]);

    return (
        <div className="root-container">
            <div ref={rootRef} className="relative-container">
                {childElements}
            </div>
        </div>
    );
}