import React, { useEffect, useState, useRef, useLayoutEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import { useLayoutController } from "../../Providers/LayoutProvider";

import "./Container.scss"
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

    // Create the container API that will be used by the controller.
    const containerAPI = useRef({});
    containerAPI.current = {
        /**
         * Applies the provided size to the container reference.
         * @param {Object} size 
         */
        updateSize: (size) => {
            console.log(size);
            for (const key in size) {
                if (key === "display" && size[key] === "none") {
                    if (containerRef.current.classList.contains("hiding")) return;
                    containerRef.current.classList.add("hiding");
                } else if (key === "display" && size[key] === "flex") {
                    if (!containerRef.current.classList.contains("hiding")) return;
                    containerRef.current.classList.remove("hiding");   
                } else {                    
                    containerRef.current.style[key] = size[key];
                }
            }
        }
    };

    // Render child containers and regsiter API with the controller.
    useLayoutEffect(() => {
        if (node && controller && containerRef.current) {

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
            
            setChildElements(hasChildren?processContainer(node):null);
            
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