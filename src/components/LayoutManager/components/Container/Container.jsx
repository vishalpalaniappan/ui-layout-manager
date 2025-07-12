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
     * This function renders children of each container
     * if they exist. If there are no children, this function
     * returns a placeholder. In the future, the provided
     * component will be loaded instead.
     * @param {Object} child 
     * @returns 
     */
    const renderChild = (child) => {
        if ("children" in child) {
            return <Container layout={child} type={child.childType}/>;
        } else {
            return <PlaceHolder panelCount={++panelCount} panel={{}} />
        }
    }

    /**
     * 
     * @param {Object} child A JSON object which contains layout information about the child.
     * @param {Number} index 
     * @returns 
     */
    const getRowDiv = (child, index) => {
        return <Row container={child} renderHandle={index >0}>
            {renderChild(child)}
        </Row>
    }


    /**
     * 
     * @param {Object} child A JSON object which contains layout information about the child.
     * @param {Number} index
     * @returns 
     */
    const getColDiv = (child, index) => {
        return <Column container={child} renderHandle={index >0}>
            {renderChild(child)}
        </Column>
    }

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
                _childDivs.push(getRowDiv(child, index));
            } else if (type === "column") {
                _childDivs.push(getColDiv(child, index));
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