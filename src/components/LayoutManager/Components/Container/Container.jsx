import React, { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import { HandleBar } from "../HandleBar/HandleBar";
import { LazyLoader } from "../LazyLoader/LazyLoader";
import { useLayoutController } from "../../Providers/LayoutProvider";

import { calculateInitialSizes } from "./calculateSizes";

import "./Container.scss"

/**
 * Renders each of the children for the current container.
 * 
 * @param {Object} layout The layout of this container including its children.
 * @return {JSX}
 */
export const Container = ({layout}) => {

    const controller = useLayoutController();

    const [childDivs, setchildDivs] = useState();

    const [containerClass, setContainerClass] = useState("relative-container");

    const containerRef = useRef();
    const childRefs = useRef([]);

    const HANDLE_SIZE_PX = 1;
   
    /**
     * This function loops through the children, sets the style and 
     * adds the child component to the list to be rendered. 
     * 
     * The function accepts two arguments, fixedProp and dynamicProp.
     * This indicates which style property should be set to 100%
     * and which style prop should be loaded from the LDF file.
     * For example, if the child is a column, then the width should
     * be dynamic and the height should be fixed (100%);
     * 
     * It sets the style based on the child type:
     * - "percent": apply relative layout in percentage
     * - "fixed": set fixed size of child in pixels
     * - "fill": fills the rest of the container
     * 
     * Fixed can only be used with fill. You can have one
     * fixed column before and one after the fill. 
     * 
     * Valid Combinations:
     * [percent][percent][percent]
     * [percent (with initial size)][percent][percent (with initial size)]
     * [fixed][fill][fixed]
     * [fixed][fill]
     * [fill][fixed]
     * 
     * @param {Object} layout 
     * @param {String} fixedProp Style prop that is fixed to 100% based on child type.
     * @param {String} dynamicProp Style prop to set dynamically from ldf file.
     */
    const processLayout = (layout, fixedProp, dynamicProp) => {
        const _childDivs = [];

        layout = calculateInitialSizes(containerRef, layout, dynamicProp);

        const parentSize = containerRef.current.getBoundingClientRect()[dynamicProp];
        const handleBarSizeInPercentage = (HANDLE_SIZE_PX/parentSize) *100;

        layout.children.forEach((child,index) => {
            let style = {};
            let renderHandle;

            switch(child.type) {
                case "percent":
                    style[fixedProp] = "100%";
                    style[dynamicProp] = child[dynamicProp] + "%";
                    renderHandle = (index < layout.children.length - 1);
                    break;
                case "fixed":
                    style[fixedProp] = "100%";
                    style[dynamicProp] = child[dynamicProp];
                    renderHandle = false;
                    break;
                case "fill":
                    style[fixedProp] = "100%";
                    style.flexGrow = 1;
                    renderHandle = false;
                    break;
                default:
                    console.error("Child layout type is invalid!")
                    break;
            }

            if ("background" in child) {
                style["background"] = child.background;
            }

            // Create child div and attach ref
            const childRefIndex = createRefAndGetIndex();
            const childDiv = <div key={childRefIndex} ref={(el) => (childRefs.current[childRefIndex] = el)} style={style}>
                {
                    layout.childType == "row" ? 
                    <div className="rowContainer"> {getChildJsx(child)}</div>:
                    layout.childType == "column" ?
                    <div className="columnContainer">{getChildJsx(child)}</div>:
                    null
                }
            </div>

            // Add new ref for handlebar, get index and update size to account for handle bar
            let postHandleDiv;
            if (renderHandle) {
                style[dynamicProp] = (child[dynamicProp] - handleBarSizeInPercentage)+ "%";

                const handleRefIndex = createRefAndGetIndex();
                postHandleDiv = <HandleBar key={index + "handle"}
                    index={handleRefIndex} 
                    getSiblings={getSiblings} 
                    orientation={layout.childType}
                    ref={(el) => (childRefs.current[handleRefIndex] = el)}
                />
            }

            const childElements = [childDiv, postHandleDiv]

            _childDivs.push(
                <React.Fragment key={index}>
                    {childElements}
                </React.Fragment>
            );
        });

        setchildDivs(<>{_childDivs}</>);
    }

    /**
     * This function adds a child ref to the ref array and returns the index
     * @returns {Number} 
     */
    const createRefAndGetIndex = () => {
        childRefs.current.push(React.createRef());
        return childRefs.current.length - 1;
    }

    /**
     * This function returns a container to render the children if they exist 
     * or lazy loads the component if there are no children.
     * @param {Object} child 
     * @returns 
     */
    const getChildJsx = (child) => {
        if ("children" in child) {
            return <Container layout={child}/>;
        } else {
            return <LazyLoader content={child} />;
        }
    }

    /**
     * This function is called by the handlebar component to get the references
     * to the siblings before and after the handle bar in the ref array. 
     * 
     * Index refers to the position of the handle bar in the ref array, so the
     * siblings will be one position before and one position after it.
     * @param {Number} index 
     * @returns 
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
                processLayout(layout,"width","height");
            } else if (layout.childType === "column") {
                setContainerClass("relative-container-column");
                processLayout(layout,"height","width");
            }

            const api = {
                setSize: (width, height) => {

                },
                getSize: (width, height) => {
                    return containerRef.current.getBoundingClientRect();
                },
                setStyle: (prop, value) => {

                },
                printSize: () => {
                    console.log(layout.id, containerRef.current.getBoundingClientRect());
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