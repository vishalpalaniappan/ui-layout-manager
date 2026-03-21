import React, { createContext, useState, useCallback, useMemo } from "react";

const DragContext = createContext(null);


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

    const [dragState, setDragState] = useState({
        activeId: null,
        activeData: null,
        overId: null,
        overData: null,
        isDragging: false
    });


    const [drop, setDrop] = useState(null);

    const handleDragStart = useCallback((event) => {
        console.log("Drag Started", event.active?.id);
        setDragState({
            activeId: event.active?.id ?? null,
            activeData: event.active?.data?.current ?? null,
            overId: null,
            overData: null,
            isDragging: true
        });
    }, []);

    const handleDragOver = useCallback((event) => {
        console.log("Drag Over Element:", event.over?.id);
        setDragState((prev) => ({
            ...prev,
            overId: event.over?.id ?? null,
            overData: event.over?.data?.current ?? null,
        }));
    }, []);

    const clearDrag = useCallback((event) => {
        console.log("Cleared Drag");
        setDrop({
            activeId: event.active?.id ?? null,
            activeData: event.active?.data?.current ?? null,
            overId: event.over?.id ?? null,
            overData: event.over?.data?.current ?? null,
        });
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
        drop,
        handleDragStart,
        handleDragOver,
        clearDrag,
    }), [dragState, drop, handleDragStart, handleDragOver, clearDrag]);

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