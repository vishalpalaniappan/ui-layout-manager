import React, { useEffect, useState, useRef, createContext, useContext } from "react";
import PropTypes from 'prop-types';
import { Container } from "../Container/Container";

import "./RootContainer.scss"
/**
 * Root container of the layout tree. This component will start 
 * rendering the tree and it will also watch for changes in the
 * root container sizes to process layout changes.
 * 
 * @param {Object} layout The layout of this container including its children.
 * @return {React.ReactElement}
 */
export const RootContainer = ({layout}) => {


    return (
        <div className="background">
            <Container layout={layout} />
        </div>
    );
}

RootContainer.propTypes = {
    ldf: PropTypes.object,
}