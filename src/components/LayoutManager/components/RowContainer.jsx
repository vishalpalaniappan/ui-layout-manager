import React, { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import { ColumnContainer } from "./ColumnContainer";
import { getPlaceHolder } from "./getPlaceHolder";

import "./styles.scss"

/**
 * Renders the RowContainer.
 * 
 * @param {Array} childContainers
 * @return {JSX}
 */
export const RowContainer = ({childContainers}) => {

    console.log("ROW");

    const [columns, setColumns] = useState();

    const processContainers = (children) => {
        console.log(children);
        const cols = [];
        children.forEach(child => {
            const rootEl = <div style={{"width": "100%", "height": child.height + "%"}}>
                {getPlaceHolder(child, 0)}
            </div>
            cols.push(rootEl);
        });

        setColumns(cols);
        
    }

    useEffect(() => {
        if (childContainers) {
            processContainers(childContainers);
        }
    }, [childContainers]);


    return (
        <>
            {columns}
        </>
        // <div style={{"width": "100%", "height": height,"display":"flex","flexDirection":"column"}}> 
        //     <div className="content">
        //         {children}
        //     </div>
        // </div>
    );
}

RowContainer.propTypes = {
    childContainers: PropTypes.array,
}