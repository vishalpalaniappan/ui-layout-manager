import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Column } from "../Column/Column";
import { Row } from "../Row/Row";

import "./Container.scss"

/**
 * Renders each of the children for the current container.
 * 
 * @param {Object} layout The layout of this container including its children.
 * @return {JSX}
 */
export const Container = ({layout}) => {

    const [childDivs, setchildDivs] = useState();

    /**
     * Given an layout, this function processes each child at this level
     * and renders it to the screen. Each child will process its own children
     * and this process repeats until the layout is fully rendered.
     * @param {Array} layout 
     */
    const processLayout = (layout) => {

        // TODO: Add logic to render fixed size containers (width or height)

        const _childDivs = [];

        layout.children.forEach((child,index) => {
            // If index > 0, then we include the handle bar to allow
            // the siblings to be resized.
            const showHandle = index > 0;

            if (layout.childType === "row") {
                _childDivs.push(<Row key={index} container={child} renderHandle={showHandle}/>)
            } 
            
            if (layout.childType === "column") {
                _childDivs.push(<Column key={index} container={child} renderHandle={showHandle}/>);
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