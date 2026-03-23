import React, { createContext, useState, useCallback, useMemo } from "react";

const DragContext = createContext(null);

import { useLayoutEventPublisher } from "./LayoutEventProvider";


/**
 * Exposes the drag state through a hook. The state is updated
 * by linking the drage events to dnd kit. The consuming appplication
 * uses the hook and access the latest state. This will enable the 
 * consumer to react to drag start and over to preview interactions.
 * 
 * TODO:
 * In the initial implementation, the child components will use the
 * useDrag hook and react to the state change on drop. However, 
 * eventually, I will modify it so that I only trigger the drop
 * on the component in which it was dropped. For now, all the components
 * will check to see if the drop was for them and ignore it if it isn't.
 */
export const DragProvider = ({ children }) => {
    const publish = useLayoutEventPublisher();

    const [dragState, setDragState] = useState({
        activeId: null,
        activeData: null,
        overId: null,
        overData: null,
        isDragging: false
    });

    const handleDragStart = useCallback((event) => {
        setDragState({
            activeId: event.active?.id ?? null,
            activeData: event.active?.data?.current ?? null,
            overId: null,
            overData: null,
            isDragging: true
        });
    }, []);

    const handleDragOver = useCallback((event) => {
        setDragState((prev) => ({
            ...prev,
            overId: event.over?.id ?? null,
            overData: event.over?.data?.current ?? null,
        }));
    }, []);

    const clearDrag = useCallback((event) => {
        publish({
          type: "drag:drop",
          payload: {
                activeId: event.active?.id ?? null,
                activeData: event.active?.data?.current ?? null,
                overId: event.over?.id ?? null,
                overData: event.over?.data?.current ?? null,
            },
          source: "drag-provider",
        })
        setDragState({
            activeId: null,
            activeData: null,
            overId: null,
            overData: null,
            isDragging: false,
        });
    }, []);


    const cancelDrag = useCallback((event) => {
        setDragState({
            activeId: null,
            activeData: null,
            overId: null,
            overData: null,
            isDragging: false,
        });
    }, []);

    const value = useMemo(() => ({
        dragState,
        handleDragStart,
        handleDragOver,
        clearDrag,
        cancelDrag
    }), [dragState, handleDragStart, handleDragOver, clearDrag, cancelDrag]);

    return (
        <DragContext.Provider value={value}>
            {children}
        </DragContext.Provider>
    );
}

export const useDragState = () => {
    const ctx = React.useContext(DragContext);
    if (!ctx) {
        throw new Error("useDragState must be used inside DragProvider");
    }
    return ctx;
}