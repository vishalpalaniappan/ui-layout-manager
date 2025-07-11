import React, { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import { getPlaceHolder } from "./getPlaceHolder";
import { RowContainer } from "./RowContainer";

/**
 * Renders the ColumnContainer.
 * 
 * @param {Array} childContainers 
 * @return {JSX}
 */
export const ColumnContainer = ({childContainers}) => {
    console.log("COL");
    
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
                <div key={index} info={child} style={{"height": "100%", "width": child.width + "%","float":"left"}}>
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
    );
}

ColumnContainer.propTypes = {
    childContainers: PropTypes.array
}