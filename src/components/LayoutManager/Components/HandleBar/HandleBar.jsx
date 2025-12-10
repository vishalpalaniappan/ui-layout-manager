import React, { useEffect, useState, useRef, useCallback } from "react";
import PropTypes from 'prop-types';
import { useLayoutController } from "../../Providers/LayoutProvider";

import "./HandleBar.scss";

/**
 * 
 */
export const HandleBar = ({orientation, parent, sibling1, sibling2}) => {

    const controller = useLayoutController();
    const dragStartInfo = useRef(null)
    const handleRef = useRef(null);
    const timerRef = useRef(null);
    
    const MIN_PANEL_SIZE = 50;

    /**
     * This function saves the relevant info on mouse down.
     * It does the following:
     * - Determines the dynamic prop being modified (width or height)
     * - Determines the mouse down property to track (clientY or clientX)
     * @param {MouseEvent} e 
     */
    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        let downKey, propKey, hoverClass;
        if (orientation === "horizontal") {
            downKey = "clientY";
            propKey = "height";
            hoverClass = "handleBarHorizontalHover";
        } else if (orientation === "vertical"){
            downKey = "clientX";
            propKey = "width";
            hoverClass = "handleBarVerticalHover";
        }

        const parentRef = controller.containerRefs[parent];
        const sibling1Ref = controller.containerRefs[sibling1];
        const sibling2Ref = controller.containerRefs[sibling2];

        dragStartInfo.current = {
            "downValueY": e[downKey],
            "hoverClass": hoverClass,
            "downKey": downKey,
            "propKey": propKey,
            "parentSize": parentRef.getBoundingClientRect()[propKey],
            "parentRef": parentRef,
            "sibling1Size": sibling1Ref.getBoundingClientRect()[propKey],
            "sibling2Size": sibling2Ref.getBoundingClientRect()[propKey],
        }
        
        handleRef.current.classList.add(hoverClass);
    }

    function getRelativeMousePosition(event, parentContainer) {
        const parentBounds = parentContainer.getBoundingClientRect();
        const relativeX = event.clientX - parentBounds.left;
        const relativeY = event.clientY - parentBounds.top;
        return { x: relativeX, y: relativeY };
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

        console.log(getRelativeMousePosition(e, startInfo.parentRef));

        // Use delta from starting down point to calculate new heights
        const delta = e[startInfo.downKey] - startInfo.downValueY;
        const newSibling1Size = startInfo.sibling1Size + delta;
        const newSibling2Size = startInfo.sibling2Size - delta;

        controller.containerRefs[sibling1].style[startInfo.propKey] = newSibling1Size + "px";
        controller.containerRefs[sibling2].style[startInfo.propKey] = newSibling2Size + "px";

        clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            // Resize here
            const rootRef = controller.containerRefs["root"];
            const rect = rootRef.getBoundingClientRect();
            controller.handleRootResize(rect.width,rect.height);
        }, 0.1);
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
                <div onMouseDown={(e) => handleMouseDown(e)} className="handleBarHorizontalContainer">
                    <div ref={handleRef} className="handleBarHorizontal"></div>
                </div>:
                orientation === "vertical"?
                <div onMouseDown={(e) => handleMouseDown(e)} className="handleBarVerticalContainer">
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
    sibling2: PropTypes.string,
    parent: PropTypes.string
}