import { useEffect, useState } from "react";
import PropTypes from 'prop-types';

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

    useEffect(() => {
        if (container) {
            setColumnStyle({
                "height": "100%",
                "width": container.width + "%",
                "float":"left",
                "display":"flex",
                "flexDirection":"row"
            })
        }
    }, [container])

    return (
        <div style={columnStyle}> 
            {renderHandle && <div className="handleBarHorizontal"></div>}
            <div className="contentHorizontal">
                {children}
            </div>
        </div>
    );
}

Column.propTypes = {
    children: PropTypes.object,
    container: PropTypes.object,
    renderHandle: PropTypes.bool
}