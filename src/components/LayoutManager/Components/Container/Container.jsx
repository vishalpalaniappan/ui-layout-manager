import React, { useEffect, useState, useRef, createContext, useContext, useCallback, useMemo } from "react";
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
         // Ensure ref is mounted
        if (!containerRef.current) return null;

        // If no children, then this is a leaf node, apply background and return.
        if (!node || !node.children || node.children.length === 0) {
            containerRef.current.style.background = node.background;
            return null;
        }

        // Set flex properties based on orientation.
        if (node.orientation === "horizontal") {
            containerRef.current.style.display = "flex";
            containerRef.current.style.flexDirection = "row";
        } else if (node.orientation === "vertical") {
            containerRef.current.style.display = "flex";
            containerRef.current.style.flexDirection = "column";
        } else {
            console.warn("Unknown orientation:", node.orientation);
        }

        // Render child containers.
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
            containerRef.current.style.width = size.width + "px";
            containerRef.current.style.height = size.height + "px";
        }
    };

    // Render child containers and regsiter API with the controller.
    useEffect(() => {
        if (node) {
            setChildElements(processContainer(node));
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