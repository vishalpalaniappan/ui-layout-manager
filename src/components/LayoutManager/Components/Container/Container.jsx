import React, { useEffect, useState, useRef, createContext, useContext, useCallback, useMemo } from "react";
import PropTypes from 'prop-types';
import { HandleBar } from "../HandleBar/HandleBar";
import { LazyLoader } from "../LazyLoader/LazyLoader";
import { useLayoutController } from "../../Providers/LayoutProvider";

import "./Container.scss"
/**
 * Renders each of the children for the current container.
 * 
 * @param {Object} layout The layout of this container including its children.
 * @return {React.ReactElement}
 */
export const Container = ({layout, parentOrientation}) => {

    const controller = useLayoutController();

    const [childElements, setChildElements] = useState(null);
    const [renderHandle, setRenderHandle] = useState(false);
    const [sibling1, setSibling1] = useState(null);
    const [sibling2, setSibling2] = useState(null);

    const [contentContainerClass, setContentContainerClass] = useState(null);
    const [handleContainerClass, setHandleContainerClass] = useState(null);

    const containerRef = useRef(null);
    const handleRef = useRef(null);
    const childRefs = useRef(new Map());
   
    /**
     *
     * 
     * @param {Object} layout 
     */
    const processLayout = (layout) => {
        const childElements = [];   

        if (!("children" in layout)) {
            if ("component" in layout) {
                childElements.push(<LazyLoader key={layout.id} content={layout} />)
            } 
            return childElements;
        }
   
        for (let index = 0; index < layout.children.length; index++) {
            childElements.push(
                <Container key={index} layout={layout.children[index]} parentOrientation={layout.childType}/>
            );
        };

        return childElements;
    }


    const containerAPI = useRef({});
    containerAPI.current = {};

    useEffect(() => {
        if (layout) {
            setChildElements(processLayout(layout));

            controller.registerContainer(layout.id, containerAPI, containerRef.current);

            return () => {
                controller.unregisterContainer(layout.id);
            }
        }
    }, [layout, controller]);

    return (
        <div ref={containerRef} className={"relative-container"}>
            <div className={contentContainerClass}>
                {childElements}
            </div>
            {renderHandle && 
                <div className={handleContainerClass}>
                    <HandleBar 
                        ref = {handleRef}
                        orientation={parentOrientation} 
                        siblingRefs={childRefs.current} 
                        parentRef={containerRef.current}
                        id1={sibling1} 
                        id2={sibling2}
                    />
                </div>
            }
        </div>
    );
}

Container.propTypes = {
    layout: PropTypes.object,
}