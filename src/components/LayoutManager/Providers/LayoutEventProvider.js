import React, { createContext, useContext, useEffect, useMemo, useRef } from "react";
import LayoutEventController from "../Controller/LayoutEventController";

const LayoutEventContext = createContext(null);

export function LayoutEventProvider({ children }) {
    const controller = useMemo(() => new LayoutEventController(), []);

    return (
        <LayoutEventContext.Provider value={controller}>
            {children}
        </LayoutEventContext.Provider>
    );
}

/**
 * Hook to publish an event.
 * @returns 
 */
export function useLayoutPublisher() {
    const controller = useContext(LayoutEventContext);

    if (!controller) {
        throw new Error("useLayoutPublisher must be used within LayoutEventProvider");
    }

    // Return publish that is bound to the controller
    return controller.publish.bind(controller);
}

/**
 * Hook to subscribe to event.
 * @param {String} type 
 * @param {Function} handler 
 */
export function useLayoutSubscription(type, handler) {
    const controller = useContext(LayoutEventContext);
    const handlerRef = useRef(handler);

    // Handler is saved in ref an passed into the subscription, this causes
    // the publisher to invoke the handler and notify all subscribers
    handlerRef.current = handler;

    useEffect(() => {
        if (!controller) {
            throw new Error("useLayoutSubscription must be used within LayoutEventProvider");
        }

        // controller.subscribe returns unsubscribe function, so it is called automatically
        // when the component is unmounted
        return controller.subscribe(type, (event) => {
            handlerRef.current(event);
        });
    }, [controller, type]);
}