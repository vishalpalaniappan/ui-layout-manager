import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Container } from "../Container/Container";
import { PlaceHolder } from "../PlaceHolder/PlaceHolder";

import "./Row.scss";

/**
 * Renders a row.
 * @param {Object} children
 * @param {Object} container 
 * @param {Boolean} renderHandle 
 * @returns 
 */
export const Row = ({children, container, renderHandle}) => {

    const [rowStyle, setRowStyle] = useState({});
    const [childDivs, setChildDivs] = useState(<></>)
    
    /**
     * This function loads the children into a container if they
     * exist and if there are no children, it renders a placeholder.
     * @param {Object} child 
     * @returns 
     */
    const renderChildren = (child) => {
        if ("children" in child) {
            return <Container layout={child} type={child.childType}/>;
        } else {
            return <PlaceHolder panelCount={1} panel={{}} />
        }
    }

    useEffect(() => {
        if (container) {
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
            {renderHandle && 
                <div className="handleBarVertical"></div>
            }
            <div className="contentVertical">
                {childDivs}
            </div>
        </div>
    );
}

Row.propTypes = {
    children: PropTypes.object,
    container: PropTypes.object,
    renderHandle: PropTypes.bool
}