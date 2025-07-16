import { lazy, useEffect, useState,useMemo, useRef, Suspense, useContext } from "react";
import PropTypes from 'prop-types';
import RegistryContext from "../../Providers/ComponentRegistryContext";

import "./PlaceHolder.scss"

/**
 * Renders the Placeholder.
 * 
 * This is a temporary component and it will replaced
 * with the component specified in the LDF file.
 * 
 * @param {Object} panel
 * @return {JSX}
 */
export const PlaceHolder = ({panel}) => {
    const {registry} = useContext(RegistryContext);

    const LazyComponent = useMemo(() => {
        if (registry && "component" in panel) {
            return lazy(registry[panel["component"]]);
        }
    }, [registry]);

    const outerDiv =  {
        "width": "100%",
        "height": "100%",
        "position": "relative",
        "fontFamily":"Roboto"
    }

    const innerDiv = {
        "position": "absolute",
        "top": "2px",
        "left": "2px",
        "right": "2px",
        "bottom": "2px",
        "overflow": "auto"
    }
    return (
        <div style={innerDiv}>
            <Suspense fallback={<div>Loading...</div>}>
                {LazyComponent && <LazyComponent />}
            </Suspense>
        </div>
    );
}

PlaceHolder.propTypes = {
    panel: PropTypes.object,
}