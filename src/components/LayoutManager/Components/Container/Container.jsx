import React, { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import { Column } from "../Column/Column";
import { Row } from "../Row/Row";

import "./Container.scss"

/**
 * Renders each of the children for the current container.
 * 
 * @param {Object} layout The layout of this container including its children.
 * @return {JSX}
 */
export const Container = ({layout}) => {

    const [childDivs, setchildDivs] = useState();

    const [containerClass, setContainerClass] = useState(null);
    const containerRef = useRef();

    //TODO: Consolidate row and column containers into single component.
    //TODO: Calculate initial size of containers and layout components.
   
    /**
     * This function loops through the children, sets the style and 
     * adds the child component to the list to be rendered. 
     * 
     * It sets the style based on the child type:
     * - "percent": apply relative layout in percentage
     * - "fixed": set fixed width of child in pixels
     * - "fill": fills the rest of the container
     * 
     * Fixed can only be used with fill. You can have one
     * fixed column before and one after the fill. 
     * 
     * Ex:
     * [percent][percent][percent]
     * [fixed][fill][fixed]
     * [fixed][fill]
     * [fill][fixed]
     * 
     * There will be support for initial width for column
     * coming soon. In a relative column structure, I will 
     * 
     * 
     * @param {Object} layout 
     */
    const processColumn = (layout) => {
        const _childDivs = [];

        layout.children.forEach((child,index) => {

            let style, renderHandle;
            if (child.type === "percent") {
                style = {"height": "100%","width": child.width + "%"};
                renderHandle = index > 0;
            } else if (child.type === "fixed") {
                style = {"height": "100%","width": child.width};
                renderHandle = false;
            } else if (child.type === "fill") {
                style = {"height": "100%","flexGrow":1};
                renderHandle = false;
            }

            if ("background" in child) {
                style["background"] = child.background;
            }

            _childDivs.push(
                <div key={index} style={style}>
                    <Column key={index} container={child} renderHandle={renderHandle}/>
                </div>
            );
        });

        setchildDivs(<>{_childDivs}</>);
    }

    /**
     * Please see processColumn for information on this function. I will merge
     * the two soon because they share a lot of common logic.
     * @param {*} layout 
     */
    const processRow = (layout) => {
        const _childDivs = [];

        layout.children.forEach((child,index) => {
            let style, renderHandle;
            if (child.type === "percent") {
                style = {"width": "100%","height": child.height + "%"};
                renderHandle = index > 0;
            } else if (child.type === "fixed") {
                style = {"width": "100%","height": child.height};
                renderHandle = false;
            } else if (child.type === "fill") {
                style = {"width": "100%","flexGrow":1};
                renderHandle = false;
            }

            if ("background" in child) {
                style["background"] = child.background;
            }

            _childDivs.push(
                <div key={index} style={style}>
                    <Row key={index} container={child} renderHandle={renderHandle}/>
                </div>
            );
        });

        setchildDivs(<>{_childDivs}</>);
    }

    useEffect(() => {
        if (layout) {
            if (layout.childType === "row") {
                processRow(layout);
                setContainerClass("relative-container-row");
            } else if (layout.childType === "column") {
                processColumn(layout);
                setContainerClass("relative-container-column");
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