import React, { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import { Column } from "../Column/Column";
import { Row } from "../Row/Row";

import "./Container.scss"

/**
 * Renders each of the children for the current container.
 * 
 * @param {Object} layout The layout of this container including its children
 * @return {JSX}
 */
export const Container = ({layout}) => {

    const [childDivs, setchildDivs] = useState();

    /**
     * Given an layout, this function processes each child at this level
     * and renders it. If any of the children have a child, then a new
     * container is created and it is nested into the parent container.
     * @param {Array} layout 
     */
    const processLayout = (layout) => {

        const _childDivs = [];

        layout.children.forEach((child,index) => {
            const showHandle = index > 0;

            if (layout.childType === "row") {
                _childDivs.push(<Row container={child} renderHandle={showHandle}/>)
            } 
            
            if (layout.childType === "column") {
                _childDivs.push(<Column container={child} renderHandle={showHandle}/>);
            }
        });

        setchildDivs(_childDivs);
    }

    useEffect(() => {
        if (layout) {
            processLayout(layout);
        }
    }, [layout]);


    return (
        <>
            {childDivs}
        </>
    );
}

Container.propTypes = {
    layout: PropTypes.object,
}