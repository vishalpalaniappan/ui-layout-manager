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

            let style, renderHandle;
            if (child.type === "column") {
                style = {"height": "100%","width": child.width + "%"};
                renderHandle = index > 0;
            } else if (child.type === "fixed") {
                style = {"height": "100%","width": child.width};
                renderHandle = false;
            } else if (child.type === "fill") {
                style = {"height": "100%","flexGrow":1};
                renderHandle = false;
            }

            if ("background" in child) {
                style["background"] = child.background;
            }

            console.log(style);

            _childDivs.push(
                <div key={index} style={style}>
                    <Column key={index} container={child} renderHandle={renderHandle}/>
                </div>
            );
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
            let style, renderHandle;
            if (child.type === "row") {
                style = {"width": "100%","height": child.height + "%"};
                renderHandle = index > 0;
            } else if (child.type === "fixed") {
                style = {"width": "100%","height": child.height};
                renderHandle = false;
            } else if (child.type === "fill") {
                style = {"width": "100%","flexGrow":1};
                renderHandle = false;
            }

            if ("background" in child) {
                style["background"] = child.background;
            }

            _childDivs.push(
                <div key={index} style={style}>
                    <Row key={index} container={child} renderHandle={renderHandle}/>
                </div>
            );
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