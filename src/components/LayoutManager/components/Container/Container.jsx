import React, { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import { PlaceHolder } from "../PlaceHolder/PlaceHolder";
import { Column } from "../Column/Column";
import { Row } from "../Row/Row";

import "./Container.scss"

let panelCount = 0;
/**
 * Renders the Container.
 * 
 * @param {Object} layout The layout of this container including its children
 * @param {String} type The type of children this container holds (row or column)
 * @return {JSX}
 */
export const Container = ({layout, type}) => {

    const [childDivs, setchildDivs] = useState();

    /**
     * Given an array of children, this function processes 
     * each child and renders it. If any of the children
     * have a child, then a new container is created
     * and it is nested into the parent container.
     * @param {Array} children 
     */
    const processChildren = (children) => {

        const _childDivs = [];

        children.forEach((child,index) => {
            if (type === "row") {
                _childDivs.push(
                    <Row container={child} renderHandle={index > 0}>
                        {renderChild(child)}
                    </Row>
                )
            } 
            
            if (type === "column") {
                _childDivs.push(
                    <Column container={child} renderHandle={index > 0}>
                        {renderChild(child)}
                    </Column>
                );
            }
        });

        setchildDivs(_childDivs);
    }

    useEffect(() => {
        if (layout) {
            // Reset panel count for the placeholder.
            if (layout.type === "root") {
                panelCount = 0;
            }
            processChildren(layout.children);
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
    type: PropTypes.string,
}