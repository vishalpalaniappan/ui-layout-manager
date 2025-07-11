import React, { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import { getPlaceHolder } from "./getPlaceHolder";
/**
 * Renders the ColumnContainer.
 * 
 * @param {Array} childContainers 
 * @return {JSX}
 */
export const ColumnContainer = ({childContainers}) => {
    console.log("COLS");
    
    const [childDivs, setchildDivs] = useState();

    const processContainers = (children) => {

        const _childDivs = [];

        children.forEach((child,index) => {
            _childDivs.push(
                <div info={child} style={{"height": "100%", "width": child.width + "%","float":"left"}}>
                    {getPlaceHolder(child, index)}
                </div>
            );
        });

        setchildDivs(_childDivs);
    }

    useEffect(() => {
        if (childContainers) {
            processContainers(childContainers);
        }
    }, [childContainers]);


    return (
        <>
            {childDivs}
        </>
    );
}

ColumnContainer.propTypes = {
    childContainers: PropTypes.array
}