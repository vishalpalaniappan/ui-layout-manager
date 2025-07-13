import { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import { Container } from "../Container/Container";
import { PlaceHolder } from "../PlaceHolder/PlaceHolder";

import "./Column.scss";

/**
 * Renders a column and creates a container to render its children if they exist. If no children
 * exist, then it renders a placeholder. Soon, this will be replaced with the component specified
 * in the LDF file.
 * 
 * @param {Object} container JSON object containing information about the container and its children.
 * @param {Boolean} renderHandle Flag to indicate if a handle should be rendered.
 * @returns 
 */
export const Column = ({container, renderHandle}) => {

    const MIN_CONTAINER_WIDTH = 50;

    const [columnStyle, setColumnStyle] = useState({});
    const [childDivs, setChildDivs] = useState(null);
    
    const dragStartInfo = useRef();
    
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
            // Once a container is loaded, set the style of the 
            // column and load the child divs.
            setColumnStyle({
                "height": "100%",
                "width": container.width + "%",
                "float":"left",
                "display":"flex",
                "flexDirection":"row"
            })
            setChildDivs(renderChildren(container));
        }
    }, [container]);


    /* TODO: The row and column containers have a lot of shared logic, 
    I should probably optimize that.*/
    

    /**
     * This function is called on a mouse down event. It saves relevant
     * information to the dragStartInfo ref so that it can be accsessed
     * during the drag event to calculate and assign the new values. 
     * 
     * Please see row component for details on how it works. 
     * 
     * @param {Event} e 
     */
    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        dragStartInfo.current = {
            "downValueX": e.clientX,
            "cont1": e.target.parentElement,
            "cont2": e.target.parentElement.previousElementSibling,
            "contWidth": e.target.parentElement.parentElement.getBoundingClientRect().width,
            "cont1Width": e.target.parentElement.getBoundingClientRect().width,
            "cont2Width": e.target.parentElement.previousElementSibling.getBoundingClientRect().width
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

        // Use delta from starting down point to calculate new widths
        const delta = e.clientX - startInfo.downValueX;
        const newPreWidth = startInfo.cont1Width - delta;
        const newPostWidth = startInfo.cont2Width + delta;

        // If within bounds, assign new height as a percentage of the container's full height
        if (newPreWidth > MIN_CONTAINER_WIDTH && newPostWidth > MIN_CONTAINER_WIDTH) {
            startInfo.cont1.style.width = (newPreWidth/startInfo.contWidth)*100 + "%";
            startInfo.cont2.style.width = (newPostWidth/startInfo.contWidth)*100 + "%";
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
        <div style={columnStyle}> 
            {renderHandle && <div onMouseDown={handleMouseDown} className="handleBarHorizontal"></div>}
            <div className="contentHorizontal">
                {childDivs}
            </div>
        </div>
    );
}

Column.propTypes = {
    container: PropTypes.object,
    renderHandle: PropTypes.bool
}