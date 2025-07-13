import { useEffect, useState } from "react";
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

    const [columnStyle, setColumnStyle] = useState({});
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

    return (
        <div style={columnStyle}> 
            {renderHandle && <div className="handleBarHorizontal"></div>}
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