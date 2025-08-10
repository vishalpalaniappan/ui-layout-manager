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
     * Sets a reference to the provided element using the provided id
     * @param {String} id 
     * @returns 
     */
    const setRefAtIndex = (id) => (el) => {
        if (!el) return;
        el.id = id;
        childRefs.current.set(el.id, el);
    };
   
    /**
     *
     * 
     * @param {Object} layout 
     */
    const processLayout = (layout) => {
        const childElements = [];     

        if (!layout || !("children" in layout)) {
            return childElements;
        }
        if (!("children" in layout) && "component" in layout) {
            return <React.Fragment></React.Fragment>
            // return  (
            //     <div key={layout.id} ref={setRefAtIndex(layout.id)} className="panel-container">
            //         <LazyLoader content={layout} />
            //     </div>
            // )
        } else if (!("children" in layout)) {
            return <React.Fragment></React.Fragment>
        }
   
        for (let index = 0; index < layout.children.length; index++) {
            const child = layout.children[index];
            
            // Add Container
            childElements.push((
                <div key={index} ref={setRefAtIndex(child.id)} >
                    <Container layout={child} parentOrientation={layout.childType}/>
                </div>
            ));
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