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
     * Process the node in the layout tree and return the child elements.
     * @param {Object} node 
     */
    const processNode = (node) => {

        if (!node || !node.children || node.children.length === 0) {
            return null;
        }

        const childElements = [];   
   
        for (let index = 0; index < node.children.length; index++) {
            const child = controller.ldf.containers[node.children[index]];
            childElements.push(<Container key={index} node={child}/>);
        };

        return childElements;
    }

    // Create the container API that will be used by the controller.
    const containerAPI = useRef({});
    containerAPI.current = {};

    // Render child containers and regsiter API with the controller.
    useEffect(() => {
        if (node) {
            setChildElements(processNode(node));

            controller.registerContainer(node.id, containerAPI, containerRef.current);

            return () => {
                controller.unregisterContainer(node.id);
            }
        }
    }, [node, controller]);

    return (
        <div ref={containerRef} className={"relative-container"}>
            {childElements}
        </div>
    );
}

Container.propTypes = {
    node: PropTypes.object,
}