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

   
    const processColumn = (layout) => {
        const _childDivs = [];

        layout.children.forEach((child,index) => {

            let childDiv;
            if (child.type === "column") {
                childDiv = <div key={index} style={{"height": "100%","width": child.width + "%"}}>
                    <Column container={child} renderHandle={index > 0}/>
                </div>
            } else if (child.type === "fixed") {
                childDiv = <div key={index} style={{"height": "100%","width": child.width,"float":"left"}}>
                    <Column key={index} container={child} renderHandle={false}/>
                </div>
            } else if (child.type === "fill") {
                childDiv = <div key={index} style={{"height": "100%","flexGrow":1}}>
                    <Column key={index} container={child} renderHandle={false}/>
                </div>
            }

            _childDivs.push(childDiv);
        });

        setchildDivs(
            <div className="relative-container-column">
                {_childDivs}
            </div>
        );
    }


    const processRow = (layout) => {
        const _childDivs = [];

        layout.children.forEach((child,index) => {
            let childDiv;
            if (child.type === "row") {
                childDiv = <div style={{"width": "100%","height": child.height + "%"}}>
                    <Row key={index} container={child} renderHandle={index > 0}/>
                </div>
            } else if (child.type === "fixed") {
                childDiv = <div style={{"width": "100%","height": child.width,"float":"left"}}>
                    <Row key={index} container={child} renderHandle={false}/>
                </div>
            } else if (child.type === "fill") {
                childDiv = <div style={{"width": "100%","flexGrow":1}}>
                    <Row key={index} container={child} renderHandle={false}/>
                </div>
            }
            _childDivs.push(childDiv);
        });

        setchildDivs(
            <div className="relative-container-row">
                {_childDivs}
            </div>
        );
    }

    useEffect(() => {
        if (layout) {
            if (layout.childType === "row") {
                processRow(layout);
            } else if (layout.childType === "column") {
                processColumn(layout);
            }
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