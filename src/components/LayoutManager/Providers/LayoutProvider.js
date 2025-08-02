import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { LayoutController } from "../Controller/LayoutController";
import PropTypes from 'prop-types';

const LayoutContext = createContext(null);

/**
 * A provider to expose the controller to all the children.
 * @param {Object} props
 * @param {Object} props.layout - Layout definition JSON object
 * @param {React.ReactNode} props.children - React children to render
 * @returns {React.ReactElement}
 */
export function LayoutControllerProvider({ layout, children }) {
    
    const controller = useMemo( () => {
        return new LayoutController(layout);
    }, [layout]);

    useEffect(() => {
        return () => {
            controller.destroy();
        }
    }, [controller]);

    return (
        <LayoutContext.Provider value={controller}>
            {children}
        </LayoutContext.Provider>
    )
}

LayoutControllerProvider.propTypes = {
    layout: PropTypes.object,
    children: PropTypes.node.isRequired
}

/**
 * A hook to access the controller within containers.
 * @returns {Object}
 */
export function useLayoutController() {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error("useLayoutController must be used within a LayoutControllerProvider")
    }
    return context;
}