import React, { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import { Column } from "../Column/Column";
import { Row } from "../Row/Row";

import { calculateInitialSizes } from "./calculateSizes";

import "./Container.scss"

/**
 * Renders each of the children for the current container.
 * 
 * @param {Object} layout The layout of this container including its children.
 * @return {JSX}
 */
export const Container = ({layout}) => {

    const [childDivs, setchildDivs] = useState();

    const [containerClass, setContainerClass] = useState("relative-container");

    const containerRef = useRef();
   
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

        layout.children.forEach((child,index) => {
            let style = {};
            let renderHandle;

            switch(child.type) {
                case "percent":
                    style[fixedProp] = "100%";
                    style[dynamicProp] = child[dynamicProp] + "%";
                    renderHandle = index > 0;
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

            _childDivs.push(
                <div key={index} style={style}>
                    {
                        layout.childType == "row" ? 
                        <Row key={index} container={child} renderHandle={renderHandle}/>:
                        layout.childType == "column" ?
                        <Column key={index} container={child} renderHandle={renderHandle}/>:
                        null
                    }
                </div>
            );
        });

        setchildDivs(<>{_childDivs}</>);
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
        }
    }, [layout]);


    return (
        <div ref={containerRef} className={containerClass}>
            {childDivs}
        </div>
    );
}

Container.propTypes = {
    layout: PropTypes.object,
}