import { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import { Container } from "../Container/Container";
import { LazyLoader } from "../LazyLoader/LazyLoader";

import "./Row.scss";

/**
 * Renders a row and creates a container to render its children if they exist. If no children
 * exist, then it renders a placeholder. Soon, this will be replaced with the component
 * specified in the LDF file.
 * 
 * @param {Object} container JSON object containing information about the container and its children.
 * @param {Boolean} renderHandle Flag to indicate if a handle should be rendered.
 * @returns 
 */
export const Row = ({container, renderHandle}) => {

    const MIN_CONTAINER_HEIGHT = 50;

    const [childDivs, setChildDivs] = useState(null)

    const dragStartInfo = useRef()
    
    useEffect(() => {
        if (container) {    
            if ("children" in container) {
                setChildDivs(<Container layout={container}/>);
            } else {
                setChildDivs(<LazyLoader content={container}/>);
            }
        }
    }, [container]);


    /* TODO: The row and column containers have a lot of shared logic, 
    I should probably optimize that.*/


    /**
     * This function is called on a mouse down event. It saves relevant
     * information to the dragStartInfo ref so that it can be accsessed
     * during the drag event to calculate and assign the new values. 
     * 
     * 
     * I'm using a horizontal handle bar example because its easier to draw but 
     * it works the same way for vertical handle bars.
     * 
     * [              parentContainer                 ]
     * [ Sibling1 ][<handle>Sibling2][<handle>Sibling3]
     * 
     * In the image above, the container row is the full width and when
     * a handle is selected for Sibling1 and Sibling2 for example, the handle 
     * (which is the target div of the event that fired) is used to find
     * Sibling1 and Sibling2 using the DOM tree. 
     * 
     * In the image, I drew the handle inside Sibling2 and Sibling3 because that
     * is where it is rendered. So to get to Sibling2, you would get the parent
     * of the handle and the parents previous sibling would be Sibling1. To get the 
     * full container width, you would get the parent elements parent element.
     * 
     * In the coming updates, a callback function will be used to ask the parent
     * to approve the new values. For example, it can decide to collapse one of the
     * containers into a side menu. It can set the min and max values. With this
     * structure, we are able to centralize the logic for how each container
     * manages its children.
     * 
     * When a parent container is resized, all the children will get resized at
     * the same time. So all the child elements in the DOM tree should execute their
     * logic to react to the new values.
     * 
     * @param {Event} e 
     */
    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        const parent = e.target.parentElement;

        dragStartInfo.current = {
            "downValueY": e.clientY,
            "sibling1": parent.parentElement.previousElementSibling,
            "sibling2": parent.parentElement,
            "parentHeight": parent.parentElement.parentElement.getBoundingClientRect().height,
            "sibling1Height": parent.parentElement.previousElementSibling.getBoundingClientRect().height,
            "sibling2Height": parent.parentElement.getBoundingClientRect().height
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
        const delta = e.clientY - startInfo.downValueY;
        const newSibling1Height = startInfo.sibling1Height + delta;
        const newSibling2Height = startInfo.sibling2Height - delta;

        // If within bounds, assign new height as a percentage of the container's full height
        if (newSibling1Height > MIN_CONTAINER_HEIGHT && newSibling2Height > MIN_CONTAINER_HEIGHT) {
            startInfo.sibling1.style.height = (newSibling1Height/startInfo.parentHeight)*100 + "%";
            startInfo.sibling2.style.height = (newSibling2Height/startInfo.parentHeight)*100 + "%";
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
    }

    return (
        <div className="rowContainer"> 
            {renderHandle && <div onMouseDown={handleMouseDown} className="handleBarHorizontal"></div>}
            <div className="contentHorizontal">
                {childDivs}
            </div>
        </div>
    );
}

Row.propTypes = {
    container: PropTypes.object,
    renderHandle: PropTypes.bool
}