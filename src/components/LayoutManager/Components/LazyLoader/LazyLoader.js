import React, { lazy, useMemo, Suspense, useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import ComponentRegistryContext from "../../Providers/ComponentRegistryContext";
import { MenuBar } from "./MenuBar/MenuBar";

import "./LazyLoader.scss"

/**
 * LazyLoader component that renders a component
 * specified in the ldf file.
 * 
 * @param {Object} content
 */
export const LazyLoader = ({node}) => {
    const registry = useContext(ComponentRegistryContext);
    const [showTitle, setShowTitle] = useState(false);

    const [lazyContainerTop, setLazyContainerTop] = useState(0);

    const LazyComponent = useMemo(() => {
        if (registry && node && "component" in node && node["component"] in registry) {
            return lazy(registry[node["component"]]);
        }
    }, [registry, node]);

    useEffect(() => {
        if ("title" in node) {
            setShowTitle(true);
            setLazyContainerTop(35)
        } else {
            setShowTitle(false);
            setLazyContainerTop(0)
        }
    }, [node]);

    return (
        <div className="absoluteContainer">
            <div className="contentContainer">
                {
                    showTitle && 
                        <div className="menuContainer">
                            <MenuBar title={node.title}/>
                        </div>
                }
                <div className="lazycontainer" style={{ top: `${lazyContainerTop}px`}}>
                    <Suspense fallback={<div>Loading...</div>}>
                        {LazyComponent && <LazyComponent />}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

LazyLoader.propTypes = {
    content: PropTypes.object,
}