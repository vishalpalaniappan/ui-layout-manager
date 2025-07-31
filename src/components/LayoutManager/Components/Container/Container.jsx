import React, { useEffect, useState, useRef, useCallback } from "react";
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
export const Container = ({layout}) => {

    const controller = useLayoutController();

    const [childDivs, setChildDivs] = useState(null);

    const [containerClass, setContainerClass] = useState("relative-container");

    const containerRef = useRef(null);

    /** @type {React.RefObject<HTMLDivElement[]>} */
    const childRefs = useRef([]);

    const HANDLE_SIZE_PX = 1;

    const setRefAtIndex = (index, id) => (el) => {
        el.id = id;
        childRefs.current[index] = el;
    };
   
    /**
     *
     * 
     * @param {Object} layout 
     */
    const processLayout = (layout) => {
        if (!("childType" in layout)) {
            return  (
                <div key={layout.id} ref={setRefAtIndex(0, layout.id)}>
                    <LazyLoader content={layout} />
                </div>
            )
        }

        const childElements = [];
        
        layout.children.forEach((child,index) => {
            // Create child div and attach ref
            childElements.push((
                <div key={index} ref={setRefAtIndex(childElements.length, child.id)}>
                    <div className={layout.childType + "-container"}> 
                        <Container layout={child}/>
                    </div>
                </div>
            ));

            if (index < layout.children.length - 1 && !(child.type == "fixed" || child.type == "fill")) {
                // Add new ref for handlebar, get index and update size to account for handle bar
                childElements.push((
                    <HandleBar key={index + "handle"}
                    index={childRefs.current.length  + 1} 
                    getSiblings={getSiblings} 
                    orientation={layout.childType}
                    ref={setRefAtIndex(childElements.length, child.id + "-handle")}/>
                ));
            }
        });

        return childElements;
    }

    /**
     * This function is called by the handlebar component to get the references
     * to the siblings before and after the handle bar in the ref array. 
     * 
     * Index refers to the position of the handle bar in the ref array, so the
     * siblings will be one position before and one position after it.
     * @param {Number} index 
     * @returns {[HTMLElement, HTMLElement, HTMLElement]}
     */
    const getSiblings = (index) => {
        const sibling1 = childRefs.current[index - 1];
        const sibling2 = childRefs.current[index + 1];
        return [containerRef.current, sibling1, sibling2];
    }

    useEffect(() => {
        if (layout) {
            if (layout.childType === "row") {
                setContainerClass("relative-container-row");
            } else if (layout.childType === "column") {
                setContainerClass("relative-container-column");
            } else {
                setContainerClass("panel-container");
            }
            
            setChildDivs(processLayout(layout));

            const api = {
                setSize: (data) => {
                    childRefs.current.forEach((ref, index) => {
                        if(String(ref.id) === String(data.id)) {
                            ref[data.type][data.key] = data.value;
                        }
                    });
                },
                getSize: () => {
                    return containerRef.current.getBoundingClientRect();
                }
            }
            controller.registerContainer(layout.id, api);

            return () => {
                controller.unregisterContainer(layout.id);
            }
        }
    }, [layout, controller]);

    return (
        <div ref={containerRef} className={containerClass}>
            {childDivs}
        </div>
    );
}

Container.propTypes = {
    layout: PropTypes.object,
}