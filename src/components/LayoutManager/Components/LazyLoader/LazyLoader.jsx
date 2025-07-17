import { lazy, useMemo, Suspense, useContext } from "react";
import PropTypes from 'prop-types';
import RegistryContext from "../../Providers/ComponentRegistryContext";

import "./LazyLoader.scss"

/**
 * LazyLoader component that renders a component
 * specified in the ldf file.
 * 
 * @param {Object} content
 * @return {JSX}
 */
export const LazyLoader = ({content}) => {
    const {registry} = useContext(RegistryContext);

    const LazyComponent = useMemo(() => {
        if (registry && "component" in content && content["component"] in registry) {
            return lazy(registry[content["component"]]);
        }
    }, [registry]);

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