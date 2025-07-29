import React, { useEffect, useState, useContext } from "react";
import PropTypes from 'prop-types';
import { Container } from "./Components/Container/Container";
import ComponentRegistryContext from "./Providers/ComponentRegistryContext";
import { LayoutControllerProvider } from "./Providers/LayoutProvider";

import "./LayoutManager.scss";

/**
 * Renders the layout specified in the LDF file.
 * @param {Object} props
 * @param {Object} props.ldf - JSON object containing the Layout Definition File (LDF)
 * @param {React.ReactNode} props.registry - An object containing the registered components that will be
 * lazy loaded into the containers.
 * @return {React.ReactElement}
 */
export const LayoutManager = ({ldf, registry}) => {

    return (
        <LayoutControllerProvider layout={ldf}>
            <ComponentRegistryContext.Provider value={{registry}}>
                <div className="background">
                    {ldf? <Container layout={ldf.layout} /> : null}
                </div>
            </ComponentRegistryContext.Provider>
        </LayoutControllerProvider> 
    );
}

LayoutManager.propTypes = {
    ldf: PropTypes.object,
    registry: PropTypes.object,
}