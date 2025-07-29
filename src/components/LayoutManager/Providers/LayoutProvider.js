import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { LayoutController } from "../Controller/LayoutController";

const LayoutContext = createContext(null);

/**
 * A provider to expose the controller to all the children.
 * @param {JSX} children
 * @returns 
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