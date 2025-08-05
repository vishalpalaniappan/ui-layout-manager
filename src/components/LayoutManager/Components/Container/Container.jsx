import React, { useEffect, useState, useRef, createContext, useContext, useCallback } from "react";
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
    const [childContainer, setChildContainer] = useState(<></>);
    const [renderHandle, setRenderHandle] = useState(true);
    const [sibling1, setSibling1] = useState(null);
    const [sibling2, setSibling2] = useState(null);

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
        // if (!("children" in layout) && "component" in layout) {
        //     return  (
        //         <div key={layout.id} ref={setRefAtIndex(layout.id)} className="panel-container">
        //             <LazyLoader content={layout} />
        //         </div>
        //     )
        // } else if (!("children" in layout)) {
        //     return <></>
        // }
   
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


    const containerAPI = React.useMemo(() => ({
        setSize: (data) => {
            for (const transformation of data) {
                const id = transformation.id;
                const style = transformation.style;
                const el = childRefs.current.get(String(id));
                Object.assign(el.style, style);

                console.log(layout.id, layout.children, transformation);
                setRenderHandle(transformation.renderHandle);
                if (transformation.renderHandle) {
                    setSibling1(transformation.sibling1);
                    setSibling2(transformation.sibling2);
                }
            }
        },
        getSize: () => {
            return containerRef.current.getBoundingClientRect();
        }
    }), [controller, renderHandle]);

    useEffect(() => {
        console.log("IN STATE:",renderHandle);
    }, [renderHandle]);

    const [contentContainerClass, setContentContainerClass] = useState(null);
    const [handleContainerClass, setHandleContainerClass] = useState(null);

    useEffect(() => {
    if (layout) {
            
            // setContentContainerClass("columnContentContainer");
            // setHandleContainerClass("columnHandleBarContainer");
            // setContentContainerClass("rowContentContainer");
            // setHandleContainerClass("rowHandleBarContainer");
            console.log(parentOrientation);

            if (parentOrientation === "column") {
                console.log("Setting column styes");
                setContentContainerClass("columnContentContainer");
                setHandleContainerClass("columnHandleBarContainer");
            } else if (parentOrientation === "row") {
                console.log("Setting row styes");
                setContentContainerClass("rowContentContainer");
                setHandleContainerClass("rowHandleBarContainer");
            } else {
                // setContentContainerClass("rowContentContainer");
                // setHandleContainerClass("rowHandleBarContainer");
                
            }

            setChildElements(processLayout(layout));

            controller.registerContainer(layout.id, containerAPI);

            return () => {
                controller.unregisterContainer(layout.id);
            }
        }
    }, [layout, controller, containerAPI]);

    // useEffect(() => {
    //     setTimeout(() => {
    //         setContentContainerClass("columnContentContainer");
    //         setHandleContainerClass("columnHandleBarContainer");
    //         // setRenderHandle(true);
    //         console.log("Setters called");
    //     }, 2000);
    // }, [renderHandle]);

    return (
        <div ref={containerRef} className={"relative-container"}>
            <div className={contentContainerClass}>
                {childElements}
            </div>
            {renderHandle && <div className={handleContainerClass}></div>}
        </div>
    );
}

Container.propTypes = {
    layout: PropTypes.object,
}