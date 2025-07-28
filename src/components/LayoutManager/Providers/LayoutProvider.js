import React, { createContext, useContext, useMemo } from 'react';
import { LayoutController } from "../Controller/LayoutController";

const LayoutContext = createContext(null);

export function LayoutControllerProvider({ children }) {

    const controller = useMemo( () => {
        return new LayoutController()
    }, []);

    return (
        <LayoutContext.Provider value={controller}>
            {children}
        </LayoutContext.Provider>
    )
}

export function useLayoutController() {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error("useLayoutController must be within a LayoutControllerProvider")
    }
    return context;
}