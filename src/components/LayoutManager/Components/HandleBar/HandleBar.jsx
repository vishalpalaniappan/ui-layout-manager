import React, { useEffect, useState, useRef, useCallback } from "react";
import PropTypes from 'prop-types';

import "./HandleBar.scss";

/**
 * 
 */
export const HandleBar = ({orientation, sibling1, sibling2}) => {

    const dragStartInfo = useRef(null)
    const handleRef = useRef(null);

    /**
     * This function saves the relevant info on mouse down.
     * It does the following:
     * - Determines the dynamic prop being modified (width or height)
     * - Determines the mouse down property to track (clientY or clientX)
     * @param {Event} e 
     */
    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        let downKey, propKey, hoverClass;
        if (orientation === "row") {
            downKey = "clientY";
            propKey = "height";
            hoverClass = "handleBarHorizontalHover";
        } else if (orientation === "column"){
            downKey = "clientX";
            propKey = "width";
            hoverClass = "handleBarVerticalHover";
        }
        
        handleRef.current.classList.add(hoverClass);
    }

    /**
     * This function is called when the mouse is being dragged and 
     * it uses the delta from the starting down point to calculate
     * the new sizes (width or height). 
     * @param {Event} e 
     * @returns 
     */
    const handleMouseMove = (e) => {
        if (!dragStartInfo.current) return;
        e.preventDefault();
        e.stopPropagation();

        const startInfo = dragStartInfo.current;

        // Use delta from starting down point to calculate new value
        const delta = e[startInfo.downKey] - startInfo.downValueY;
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
        handleRef.current.classList.remove(dragStartInfo.current.hoverClass);  
        dragStartInfo.current = null;        
    }

    return (
        <React.Fragment > 
            {
                orientation === "horizontal"?
                <div onMouseDown={(e) => handleMouseDown} className="handleBarHorizontalContainer">
                    <div ref={handleRef} className="handleBarHorizontal"></div>
                </div>:
                orientation === "vertical"?
                <div onMouseDown={(e) => handleMouseDown} className="handleBarVerticalContainer">
                    <div ref={handleRef} className="handleBarVertical"></div>
                </div>:
                null
            }
        </React.Fragment>
    );
};

HandleBar.propTypes = {
    orientation: PropTypes.string,
    sibling1: PropTypes.string,
    sibling2: PropTypes.string
}