import { useEffect, useState } from "react";
import PropTypes from 'prop-types';

/**
 * Renders the layout.
 * 
 * @param {Object} layout 
 * @return {JSX}
 */
export const ColumnContainer = ({children, id, width, height, childType}) => {
    return (
        <div
            style={{
                "float":"left",
                "width": width,
                "height": "100%",
            }}> 
                {children }
        </div>
    );
}

ColumnContainer.propTypes = {
    id: PropTypes.number,
    top: PropTypes.number,
    left: PropTypes.number,
    width: PropTypes.string,
    height: PropTypes.string,
    childType: PropTypes.string
}