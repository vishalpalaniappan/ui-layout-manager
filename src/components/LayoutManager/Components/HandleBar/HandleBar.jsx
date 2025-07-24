import React, { useEffect, useState, useRef, useCallback } from "react";
import PropTypes from 'prop-types';

import "./HandleBar.scss";

/**
 * 
 */
export const HandleBar = React.forwardRef(({orientation, getSiblings, index}, ref) => {

    const MIN_PANEL_SIZE = 50;

    const dragStartInfo = useRef()
    const handle = useRef();

    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        const [parentRef, sibling1, sibling2] = getSiblings(index);

        let downKey, propKey, hoverClass;
        if (orientation === "row") {
            downKey = "clientY";
            propKey = "height";
        } else if (orientation === "column"){
            downKey = "clientX";
            propKey = "width";
        }

        dragStartInfo.current = {
            "downValueY": e[downKey],
            "downKey": downKey,
            "propKey": propKey,
            "sibling1": sibling1,
            "sibling2": sibling2,
            "parentSize": parentRef.getBoundingClientRect()[propKey],
            "sibling1Size": sibling1.getBoundingClientRect()[propKey],
            "sibling2Size": sibling2.getBoundingClientRect()[propKey],
        }
    }

    /**
     * This function is called when the mouse is being dragged and 
     * it uses the delta from the starting down point to calculate
     * the new heights. If it is within the bounds, it sets the new
     * height. It sets the height as a percentage so the relative 
     * sizes are respected if a parent up the hierarchy is moved.
     * @param {Event} e 
     * @returns 
     */
    const handleMouseMove = (e) => {
        if (!dragStartInfo.current) return;
        e.preventDefault();
        e.stopPropagation();

        const startInfo = dragStartInfo.current;

        // Use delta from starting down point to calculate new heights
        const delta = e[startInfo.downKey] - startInfo.downValueY;
        const newSibling1Size = startInfo.sibling1Size + delta;
        const newSibling2Size = startInfo.sibling2Size - delta;

        // If within bounds, assign new height as a percentage of the container's full height
        if (newSibling1Size > MIN_PANEL_SIZE && newSibling2Size > MIN_PANEL_SIZE) {
            startInfo.sibling1.style[startInfo.propKey] = (newSibling1Size/startInfo.parentSize)*100 + "%";
            startInfo.sibling2.style[startInfo.propKey] = (newSibling2Size/startInfo.parentSize)*100 + "%";
        }
    }

    /**
     * Perform cleanup after drag event has finished.
     * @param {Event} e 
     */
    const handleMouseUp = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        dragStartInfo.current = null;        
    }

    return (
        <React.Fragment > 
            {
                orientation === "row"?
                <div ref={ref} onMouseDown={handleMouseDown} className="handleBarHorizontalContainer">
                    <div ref={handle} className="handleBarHorizontal"></div>
                </div>:
                orientation === "column"?
                <div ref={ref} onMouseDown={handleMouseDown} className="handleBarVerticalContainer">
                    <div ref={handle} className="handleBarVertical"></div>
                </div>:
                null
            }
        </React.Fragment>
    );
});

HandleBar.propTypes = {
}