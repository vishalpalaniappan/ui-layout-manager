import React, { useEffect, useState, useRef, createContext, useContext } from "react";
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
export const Container = ({layout, handleBarType}) => {

    const controller = useLayoutController();

    const [childDivs, setChildDivs] = useState(null);

    const containerRef = useRef(null);
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
        if (!("childType" in layout)) {
            return  (
                <div key={layout.id} ref={setRefAtIndex(layout.id)}>
                    <LazyLoader content={layout} />
                </div>
            )
        }

        const childElements = [];        
        for (let index = 0; index < layout.children.length; index++) {
            const child = layout.children[index];
            
            // Add Container
            childElements.push((
                <div key={index} ref={setRefAtIndex(child.id)} >
                    <Container layout={child}/>
                </div>
            ));

            // if (Number(index) == layout.children.length - 1 || ['fixed', 'fill'].includes(child.type)){
            //     continue;
            // }
            
            // const id1 = child.id;
            // const id2 = layout.children[index + 1].id;

            // // Add Handle Bar
            // childElements.push((
            //     <HandleBar 
            //         key={index + "handle"}
            //         id1={String(id1)}
            //         id2={String(id2)}
            //         siblingRefs={childRefs.current}
            //         parentRef={containerRef.current}
            //         orientation={layout.childType}
            //         ref={setRefAtIndex(childElements.length, child.id + "-handle")}
            //     />
            // ));
        };

        return childElements;
    }


    const containerAPI = {
        setSize: (data) => {
            for (const transformation of data) {

                const id = transformation[0];
                const type = transformation[1];
                const key = transformation[2];
                const value = transformation[3];
                
                const targetRef = childRefs.current.get(String(id));
                targetRef[type][key] = value;
            }
        },
        getSize: () => {
            return containerRef.current.getBoundingClientRect();
        }
    }

    useEffect(() => {
        if (layout) {
            setChildDivs(processLayout(layout));

            controller.registerContainer(layout.id, containerAPI);

            return () => {
                controller.unregisterContainer(layout.id);
            }
        }
    }, [layout, controller]);

    return (
        <div ref={containerRef} className={"relative-container"}>
            {childDivs}
        </div>
    );
}

Container.propTypes = {
    layout: PropTypes.object,
}