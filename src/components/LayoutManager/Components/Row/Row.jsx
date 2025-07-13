import { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import { Container } from "../Container/Container";
import { PlaceHolder } from "../PlaceHolder/PlaceHolder";

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

    const [rowStyle, setRowStyle] = useState({});
    const [childDivs, setChildDivs] = useState(null)

    const dragStartInfo = useRef()
    
    /**
     * This function loads the children into a container if they
     * exist and if there are no children, it renders a placeholder.
     * @param {Object} child 
     * @returns 
     */
    const renderChildren = (child) => {
        if ("children" in child) {
            return <Container layout={child}/>;
        } else {
            return <PlaceHolder panel={child} />
        }
    }

    useEffect(() => {
        if (container) {
            // Once row is loaded, set the style and
            // load the child divs.
            setRowStyle({
                "width": "100%",
                "height": container.height + "%",
                "position":"relative",
                "display":"flex",
                "flexDirection":"column"
            })
            setChildDivs(renderChildren(container));
        }
    }, [container])


    /**
     * This function is called on a mouse down event. It saves relevant
     * information to the dragStartInfo ref so that it can be accsessed
     * during the drag event to calculate and assign the new values. 
     * 
     * 
     * I'm using a horizontal handle bar example because its easier to draw but 
     * it works the same way for vertical handle bars.
     * 
     * [              container               ]
     * [ Cont 1 ][<handle>Cont2][<handle>Cont3]
     * 
     * In the image above, the container row is the full width and when
     * a handle is selected for Cont1 and Cont2 for example, the handle 
     * (which is the target div of the event that fired) is used to find
     * Cont1 and Cont2 using the DOM tree. 
     * 
     * In the image, I drew the handle inside Cont2 and Cont3 because that
     * is where it is rendered. So to get to Cont2, you would get the parent
     * of the handle and the parents previous sibling. To get the full container
     * width, you would get the parent elements parent element.
     * @param {Event} e 
     */
    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        dragStartInfo.current = {
            "downValueY": e.clientY,
            "cont1": e.target.parentElement,
            "cont2": e.target.parentElement.previousElementSibling,
            "contHeight": e.target.parentElement.parentElement.getBoundingClientRect().height,
            "cont1Height": e.target.parentElement.getBoundingClientRect().height,
            "cont2Height": e.target.parentElement.previousElementSibling.getBoundingClientRect().height
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
        const newPreHeight = startInfo.cont1Height - delta;
        const newPostHeight = startInfo.cont2Height + delta;

        // If within bounds, assign new height as a percentage of the container's full height
        if (newPreHeight > MIN_CONTAINER_HEIGHT && newPostHeight > MIN_CONTAINER_HEIGHT) {
            startInfo.cont1.style.height = (newPreHeight/startInfo.contHeight)*100 + "%";
            startInfo.cont2.style.height = (newPostHeight/startInfo.contHeight)*100 + "%";
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
        <div style={rowStyle}> 
            {renderHandle && <div onMouseDown={handleMouseDown} className="handleBarVertical"></div>}
            <div className="contentVertical">
                {childDivs}
            </div>
        </div>
    );
}

Row.propTypes = {
    container: PropTypes.object,
    renderHandle: PropTypes.bool
}