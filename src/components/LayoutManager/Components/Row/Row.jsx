import { useEffect, useState } from "react";
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
 * @returns 
 */
export const Row = ({container}) => {

    const [rowStyle, setRowStyle] = useState({});
    const [childDivs, setChildDivs] = useState(null)
    
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
            // row and load the child divs.
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

    return (
        <div style={rowStyle}> 
            <div className="contentVertical">
                {childDivs}
            </div>
        </div>
    );
}

Row.propTypes = {
    container: PropTypes.object
}