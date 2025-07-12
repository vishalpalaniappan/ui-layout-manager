import React, { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';

import "./PlaceHolder.scss"

/**
 * Renders the Placeholder.
 * 
 * @param {Object} panel
 * @param {Number} panelCount
 * @return {JSX}
 */
export const PlaceHolder = ({panel}) => {

    const outerDiv =  {
        "width": "100%",
        "height": "100%",
        "backgroundColor": "#1e1e1e",
        "position": "relative",
        "fontFamily":"Roboto"
    }

    const innerDiv = {
        "position": "absolute",
        "top": "0px",
        "left": "0px",
        "right": "0px",
        "bottom": "0px",
        "backgroundColor": "#1e1e1e",
        "display": "flex",
        "justifyContent": "center",
        "alignItems": "center",
        "color":"#BBB"
    }
    return (
        <div style={outerDiv}>
            <div className="hoverDiv" style={innerDiv}>
                {panel.id}
            </div>
        </div>
    );
}

PlaceHolder.propTypes = {
    panel: PropTypes.object,
}