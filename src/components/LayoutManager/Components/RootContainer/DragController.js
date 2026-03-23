import { useMemo } from "react";

import { useLayoutEventPublisher } from "../../Providers/LayoutEventProvider";

/**
 * Drag controller exposed through the hook. It exposes
 * callback functions which are connected to the dnd context. 
 * 
 * The controller is also initialized with the publish function
 * exposed by the useLayoutEventPublisher so it can notify
 * subscribers of any relevant events.
 */
class DragController {
    constructor({publish}) {
        this.publish = publish;
        this.resetDragState();
    }

    resetDragState = () => {
        this.dragState = {
            activeId: null,
            activeData: null,
            overId: null,
            overData: null,
            isDragging: false
        }
    }

    onDragStart = (event) => {
        this.dragState = {
            activeId: event.active?.id ?? null,
            activeData: event.active?.data?.current ?? null,
            overId: null,
            overData: null,
            isDragging: true
        };
    }

    onDragOver = (event) => {
        this.dragState.overId = event.over?.id ?? null;
        this.dragState.overData = event.over?.data?.current ?? null;
    }

    onDragEnd = (event) => {
        this.publish({
          type: "drag:drop",
          payload: {
                activeId: event.active?.id ?? null,
                activeData: event.active?.data?.current ?? null,
                overId: event.over?.id ?? null,
                overData: event.over?.data?.current ?? null,
            },
          source: "drag-provider",
        })
        this.resetDragState();
    }

    onDragCancel = (event) => {
        this.resetDragState();
    }

    isDragging = () => {
        return this.dragState.isDragging;
    }

    getDragPreview = () => {
        return this.dragState?.activeData?.preview;
    }
}

const useDragEventController = function() {
  const publish  = useLayoutEventPublisher();

  return useMemo(() => {
    return new DragController({publish});
  }, [publish]);
}

export default useDragEventController;