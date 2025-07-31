import React, { useEffect, useState, useRef, createContext, useContext } from "react";
import PropTypes from 'prop-types';
import { HandleBar } from "../HandleBar/HandleBar";
import { LazyLoader } from "../LazyLoader/LazyLoader";
import { useLayoutController } from "../../Providers/LayoutProvider";
import { RefContext } from "../../Providers/RefProvider";

import "./Container.scss"
/**
 * Renders each of the children for the current container.
 * 
 * @param {Object} layout The layout of this container including its children.
 * @return {React.ReactElement}
 */
export const Container = ({layout}) => {

    const parentRefs = useContext(RefContext);

    useEffect(() => {
        if (parentRefs === null) {
            console.log("Rendering root container.");   
        }
    }, [parentRefs]);

    const controller = useLayoutController();

    const [childDivs, setChildDivs] = useState(null);
    const [containerClass, setContainerClass] = useState("relative-container");

    const containerRef = useRef(null);
    const childRefs = useRef(new Map());

    const HANDLE_SIZE_PX = 1;

    const setRefAtIndex = (index, id) => (el) => {
        if (!el) return;
        el.id = id;
        childRefs.current.set(el.id,el);
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
        for (let index = 0; index < layout.children.length; index++) {
            const child = layout.children[index];
            // Add Container
            childElements.push((
                <div key={index} ref={setRefAtIndex(childElements.length, child.id)}>
                    <div className={layout.childType + "-container"}> 
                        <Container layout={child}/>
                    </div>
                </div>
            ));

            if (Number(index) == layout.children.length - 1 || ['fixed', 'fill'].includes(child.type)){
                continue;
            }
            
            const id1 = child.id;
            const id2 = layout.children[index + 1].id;

            // Add Handle Bar
            childElements.push((
                <HandleBar 
                    key={index + "handle"}
                    id1={String(id1)}
                    id2={String(id2)}
                    siblingRefs={childRefs.current}
                    parentRef={containerRef.current}
                    orientation={layout.childType}
                    ref={setRefAtIndex(childElements.length, child.id + "-handle")}
                />
            ));
        };

        return childElements;
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
                    const targetRef = childRefs.current.get(String(data.id));
                    targetRef[data.type][data.key] = data.value;
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
        <RefContext.Provider value={childRefs.current}>
            <div ref={containerRef} className={containerClass}>
                {childDivs}
            </div>
        </RefContext.Provider>
    );
}

Container.propTypes = {
    layout: PropTypes.object,
}