import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Container } from "../Container/Container";
import { PlaceHolder } from "../PlaceHolder/PlaceHolder";

import "./Column.scss";

/**
 * Renders a column.
 * @param {Object} children
 * @param {Object} container 
 * @param {Boolean} renderHandle 
 * @returns 
 */
export const Column = ({children, container, renderHandle}) => {

    const [columnStyle, setColumnStyle] = useState({});
    const [childDivs, setChildDivs] = useState(<></>)
    
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
            return <PlaceHolder panelCount={1} panel={{}} />
        }
    }

    useEffect(() => {
        if (container) {
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
    children: PropTypes.object,
    container: PropTypes.object,
    renderHandle: PropTypes.bool
}