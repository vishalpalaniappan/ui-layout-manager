import React, { lazy, useMemo, Suspense, useContext } from "react";
import PropTypes from 'prop-types';
import ComponentRegistryContext from "../../Providers/ComponentRegistryContext";

import "./LazyLoader.scss"

/**
 * LazyLoader component that renders a component
 * specified in the ldf file.
 * 
 * @param {Object} content
 */
export const LazyLoader = ({content}) => {
    const registry = useContext(ComponentRegistryContext);

    const LazyComponent = useMemo(() => {
        if (registry && content && "component" in content && content["component"] in registry) {
            return lazy(registry[content["component"]]);
        }
    }, [registry, content]);

    return (
        <div className="lazyContainer">
            <Suspense fallback={<div>Loading...</div>}>
                {LazyComponent && <LazyComponent />}
            </Suspense>
        </div>
    );
}

LazyLoader.propTypes = {
    content: PropTypes.object,
}