import React, { useEffect, useState, useRef, useLayoutEffect, useCallback, Children } from "react";
import PropTypes from 'prop-types';
import { useLayoutController } from "../../Providers/LayoutProvider";
import { HandleBar } from "../HandleBar/HandleBar";
import "./Container.scss"
import { LazyLoader } from "../LazyLoader/LazyLoader";

import { useLayoutEventSubscription } from "../../Providers/LayoutEventProvider";

/**
 * Renders the node and creates containers for its children.
 * Also registers itself with the controller to allow the controller
 * to set the size of the container and to apply transformations.
 * 
 * @param {Object} node The node in the layout tree.
 * @return {React.ReactElement}
 */
export const Container = ({node}) => {

    const controller = useLayoutController();
    const containerRef = useRef(null);    
    const parentOrientationRef = useRef(null);
    const [childElements, setChildElements] = useState(null);
   
    /**
     * Renders child containers recursively.
     */
    const processContainer = useCallback((node) => {
        const childElements = [];      
        for (let index = 0; index < node.children.length; index++) {
            const childNode = node.children[index];

            if (childNode.type === "container") {
                const child = controller.ldf.containers[node.children[index].containerId];
                child.parent = node;
                childElements.push(
                    <Container 
                        key={index} 
                        meta={node.children[index]} 
                        id={child.id} 
                        node={child}/>
                );
            } else if (childNode.type === "handleBar") {
                if (node.orientation === "horizontal") {
                    childElements.push(
                        <HandleBar 
                            key={index}
                            orientation="vertical" 
                            parent={node.id}
                            sibling1={childNode.sibling1}
                            sibling2={childNode.sibling2}
                        />
                    );
                } else if (node.orientation === "vertical") {
                    childElements.push(
                        <HandleBar 
                            key={index}
                            orientation="horizontal" 
                            parent={node.id}
                            sibling1={childNode.sibling1}
                            sibling2={childNode.sibling2}
                        />
                    );
                }
            }
        };
        return childElements;
    },[controller]);

    // Create the container API that will be used by the controller.
    const containerAPI = useRef({});
    containerAPI.current = {
        /**
         * Applies the provided styles (width, height, flex etc.)
         * @param {Object} styles
         */
        updateStyles: (styles) => {
            const className = "hiding-" + parentOrientationRef.current;
            for (const key in styles) {
                if (key === "display" && styles[key] === "none") {
                    if (containerRef.current.classList.contains(className)) return;
                    containerRef.current.classList.add(className);
                } else if (key === "display" && styles[key] === "flex") {
                    if (!containerRef.current.classList.contains(className)) return;
                    containerRef.current.classList.remove(className);   
                } else {                    
                    containerRef.current.style[key] = styles[key];
                }
            }
        }
    };

    // Render child containers and regsiter API with the controller.
    useLayoutEffect(() => {
        if (node && controller && containerRef.current) {
            parentOrientationRef.current = node.parent.orientation;
            const hasChildren = node.children && node.children.length > 0

            if (hasChildren) {        
                // Set flex properties based on orientation for children    
                if (node.orientation === "horizontal") {
                    containerRef.current.style.display = "flex";
                    containerRef.current.style.flexDirection = "row";
                    containerRef.current.style.width = "100%";
                } else if (node.orientation === "vertical") {
                    containerRef.current.style.display = "flex";
                    containerRef.current.style.flexDirection = "column";
                    containerRef.current.style.height = "100%";
                } else {
                    console.warn("Unknown orientation:", node.orientation);
                }
            } else {
                // No children, so its a leaf node, apply background if any.
                if (node.background) {
                    containerRef.current.style.background = node.background;
                } else {
                    containerRef.current.style.background = "transparent";
                }
            }
            
            setChildElements(hasChildren?processContainer(node):<LazyLoader node={node} />);
            
            controller.registerContainer(node.id, containerAPI, containerRef.current);
            return () => {
                controller.unregisterContainer(node.id);
            }
        }
    }, [node, controller, processContainer]);

    return (
        <div ref={containerRef} className={"relative-container"}>
            {childElements}
        </div>
    );
}

Container.propTypes = {
    node: PropTypes.object,
}