import React, { useEffect, useState, useRef, useContext } from "react";
import PropTypes from 'prop-types';
import { RefContext } from "../../Providers/RefProvider";

import "./HandleBar.scss";


/**
 * @typedef {Object} HandleBarProps
 * @property {Map} siblingRefs - Reference to sibling container.
 * @property {HTMLElement} parentRef - Reference to parent container.
 * @property {String} id1 - Id of the first container.
 * @property {String} id2 - Id of the second container.
 * @property {String} orientation - Orientation of the handle bar
 */

/**
 * @param {HandleBarProps} props
 * @param {React.Ref<any>} ref
 * @returns {React.ReactElement}
 */
const HandleBarComponent = ({orientation, siblingRefs, parentRef, id1, id2}, ref) => {

    // const parentRefs = useContext(RefContext);

    useEffect(() => {
        if (siblingRefs) {
            console.log(siblingRefs, id1, id2);

            console.log(siblingRefs.get(id1));
            console.log(siblingRefs.get(id2));

        }
    }, [siblingRefs]);

    const MIN_PANEL_SIZE = 50;

    const dragStartInfo = useRef(null)
    const handle = useRef(null);

    /**
     * This function saves the relevant info on mouse down.
     * It does the following:
     * - Determines the dynamic prop being modified (width or height)
     * - Determines the mouse down property to track (clientY or clientX)
     * - Get references to parent container and both siblings using callback to parent
     * - Saves the initial size of the siblings and parents 
     * 
     * @param {React.MouseEvent<HTMLDivElement>} e 
     */
    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        const sibling1 = siblingRefs.get(id1);
        const sibling2 = siblingRefs.get(id2);

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
        
        handle.current.classList.add(hoverClass);   

        dragStartInfo.current = {
            "downValueY": e[downKey],
            "hoverClass": hoverClass,
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
     * the new sizes (width or height). If it is within the bounds, 
     * it sets the new size. It sets the size as a percentage so 
     * the relative sizes are respected if a parent up the hierarchy
     * is moved.
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
        handle.current.classList.remove(dragStartInfo.current.hoverClass);  
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
};

/** @type {React.ForwardRefExoticComponent<React.PropsWithoutRef<HandleBarProps> & React.RefAttributes<any>>} */
export const HandleBar = React.forwardRef(HandleBarComponent);

HandleBar.propTypes = {
    orientation: PropTypes.string
}