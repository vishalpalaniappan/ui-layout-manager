import { useEffect, useState } from "react";
import PropTypes from 'prop-types';

/**
 * Renders the RowContainer.
 * 
 * @param {Array} children 
 * @param {Number} height 
 * @return {JSX}
 */
export const RowContainer = ({children, height}) => {
    console.log(height);
    return (
        <div
            style={{
                "width": "100%",
                "height": height,
            }}> 
                {children}
        </div>
    );
}

RowContainer.propTypes = {
    height: PropTypes.string,
    children: PropTypes.array
}