import { useEffect, useState } from "react";
import PropTypes from 'prop-types';

/**
 * Renders the RowContainer.
 * 
 * @param {Array} children 
 * @param {String} height eg. 50%, in the future, I might set the height
 * in pixels, so I kept the logic in the component above this and accept
 * a formatted string.
 * @return {JSX}
 */
export const RowContainer = ({children, height}) => {
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
    children: PropTypes.oneOfType([PropTypes.object,PropTypes.array])
}