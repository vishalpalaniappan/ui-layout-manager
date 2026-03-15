// @ts-nocheck
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
     * - Gets the references to the sibling elements
     * - Gets the sibling sizes from the layout
     * - Gets the sibling sizes from the layout reference
     * - Saves the information in drag start info ref for access
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

        // Get the min, max sizes of siblings 1 and 2
        let sibling1LayoutConfig, sibling2LayoutConfig;
        const parentContainer = controller.ldf.containers[parent];
        for (let i = 0; i < parentContainer.children.length; i++) {
            if (parentContainer.children[i].containerId === sibling1) {
                sibling1LayoutConfig = parentContainer.children[i].size;
            } else if (parentContainer.children[i].containerId === sibling2) {
                sibling2LayoutConfig = parentContainer.children[i].size;
            }
        }

        dragStartInfo.current = {
            "downValueY": e[downKey],
            "hoverClass": hoverClass,
            "downKey": downKey,
            "propKey": propKey,
            "parentSize": parentRef.getBoundingClientRect()[propKey],
            "parentRef": parentRef,
            "sibling1Ref": sibling1Ref,
            "sibling2Ref": sibling2Ref,
            "sibling1LayoutConfig": sibling1LayoutConfig,
            "sibling2LayoutConfig": sibling2LayoutConfig,
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

        // Use delta from starting down point to calculate new heights
        const delta = e[startInfo.downKey] - startInfo.downValueY;
        const newSibling1Size = startInfo.sibling1Size + delta;
        const newSibling2Size = startInfo.sibling2Size - delta;

        clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            // Resize here
            controller.moveHandleBar({
                handle: getRelativeMousePosition(e, startInfo.parentRef),
                parent: parent,
                sibling1: sibling1,
                sibling2: sibling2
            });
        }, 0.1);
        
        // Don't update container sizes we are past min or max values.
        const sibling1SizeKeys = Object.keys(startInfo.sibling1LayoutConfig);
        if (sibling1SizeKeys.includes("min") && newSibling1Size <= startInfo.sibling1LayoutConfig.min.value ||
            sibling1SizeKeys.includes("max") && newSibling1Size >= startInfo.sibling1LayoutConfig.max.value) {
            return;
        }
        
        // Don't update container sizes we are past min or max values.
        const sibling2SizeKeys = Object.keys(startInfo.sibling2LayoutConfig);
        if (sibling2SizeKeys.includes("min") && newSibling2Size <= startInfo.sibling2LayoutConfig.min.value ||
            sibling2SizeKeys.includes("max") && newSibling2Size >= startInfo.sibling2LayoutConfig.max.value) {
            return;
        }
        
        // If both siblings are type fill, then set sizes. Set min size of sibling sizes to 50px;
        // TODO: Make into constants and I think this should be evaluated inside the controller.
        const sibling1Type = startInfo.sibling1LayoutConfig.initial.type;
        const sibling2Type = startInfo.sibling2LayoutConfig.initial.type;
        if (sibling1Type === "fill" && sibling2Type === "fill" && newSibling1Size > 50 && newSibling2Size > 50) {
            controller.containerRefs[sibling1].style[startInfo.propKey] = newSibling1Size + "px";
            controller.containerRefs[sibling2].style[startInfo.propKey] = newSibling2Size + "px";
            return;
        }

        // Don't update fill types, flex box will take care of that
        if (!(sibling1Type === "fill")) {
            controller.containerRefs[sibling1].style[startInfo.propKey] = newSibling1Size + "px";
        }
        if (!(sibling2Type === "fill")) {
            controller.containerRefs[sibling2].style[startInfo.propKey] = newSibling2Size + "px";
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