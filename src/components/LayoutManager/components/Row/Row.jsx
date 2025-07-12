import { useEffect, useState } from "react";
import PropTypes from 'prop-types';

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

    useEffect(() => {
        if (container) {
            setRowStyle({
                "width": "100%",
                "height": container.height + "%",
                "position":"relative",
                "display":"flex",
                "flexDirection":"column"
            })
        }
    }, [container])

    return (
        <div style={rowStyle}> 
            {renderHandle && 
                <div className="handleBarVertical"></div>
            }
            <div className="contentVertical">
                {children}
            </div>
        </div>
    );
}

Row.propTypes = {
    children: PropTypes.object,
    container: PropTypes.object,
    renderHandle: PropTypes.bool
}