import { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';

import "./HandleBar.scss";

/**
 * 
 */
export const HandleBar = ({orientation}) => {

    return (
        <> 
            {
                orientation == "row"?
                <div className="handleBarHorizontal"></div>:
                orientation === "column"?
                <div className="handleBarVertical"></div>:
                null
            }
        </>
    );
}

HandleBar.propTypes = {
}