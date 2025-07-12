import React, { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import { getPlaceHolder } from "./getPlaceHolder";

import "./styles.scss"

let panelCount = 0;
/**
 * Renders the Container.
 * 
 * @param {Array} childContainers
 * @param {String} type
 * @return {JSX}
 */
export const Container = ({childContainers, type}) => {

    const [childDivs, setchildDivs] = useState();

    /**
     * This function renders children of each container
     * if they exist. If there are no children, this function
     * returns a placeholder. In the future, the provided
     * component will be loaded instead.
     * @param {Object} child 
     * @returns 
     */
    const renderChild = (child) => {
        console.log(child);
        if ("children" in child) {
            return <Container type={child.childType} childContainers={child.children}/>;
        } else {
            return getPlaceHolder({},++panelCount);
        }
    }


    const getRowDiv = (child, index) => {
        return <div style={{"width": "100%", "height": child.height + "%",position:"relative","display":"flex","flexDirection":"column"}}> 
            {index > 0 && <div className="handleBarVertical"></div>}
            <div className="contentVertical">
                {renderChild(child)}
            </div>
        </div>
    }


    const getColDiv = (child, index) => {
        return <div style={{"height": "100%", "width": child.width + "%","float":"left","display":"flex","flexDirection":"row"}}> 
            {index > 0 && <div className="handleBarHorizontal"></div>}
            <div className="contentHorizontal">
                {renderChild(child)}
            </div>
        </div>
    }

    /**
     * Given an array of children, this function renders
     * the divs and loads the children to be rendered.
     * @param {Array} children 
     */
    const processChildren = (children) => {

        const _childDivs = [];

        children.forEach((child,index) => {
            if (type === "row") {
                _childDivs.push(getRowDiv(child, index));
            } else if (type === "column") {
                _childDivs.push(getColDiv(child, index));
            }
        });

        setchildDivs(_childDivs);
    }

    useEffect(() => {
        if (childContainers) {
            console.log(childContainers, type);
            processChildren(childContainers);
        }
    }, [childContainers]);


    return (
        <>
            {childDivs}
        </>
    );
}

Container.propTypes = {
    childContainers: PropTypes.array,
    type: PropTypes.string,
}