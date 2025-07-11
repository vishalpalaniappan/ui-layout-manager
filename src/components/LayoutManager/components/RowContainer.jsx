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

    const [childDivs, setchildDivs] = useState();


    const renderChild = (child) => {

        if ("children" in child) {
            if (child.childType === "column") {
                return <ColumnContainer childContainers={child.children}/>;
            } else if (child.childType === "row") {
                return <RowContainer childContainers={child.children}/>;
            }
        } else {
            return getPlaceHolder();
        }
    }

    const processContainers = (children) => {

        const _childDivs = [];

        children.forEach((child,index) => {
            _childDivs.push(
                <div key={index} info={child} style={{"width": "100%", "height": child.height + "%"}}>
                    {renderChild(child)}
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