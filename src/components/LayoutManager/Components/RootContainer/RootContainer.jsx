import React, { useEffect, useLayoutEffect, useState, useRef, useCallback, useContext } from "react";
import PropTypes from 'prop-types';
import { Container } from "../Container/Container";
import { HandleBar } from "../HandleBar/HandleBar";
import { useLayoutController } from "../../Providers/LayoutProvider";
import {
    DndContext,
    DragOverlay,
    useDraggable,
    useDroppable,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";

import "./RootContainer.scss"


/**
 * Preview for the div being dragged.
 * @returns 
 */
function DragPreview({ label }) {
    return (
        <div
        style={{
            padding: "6px 12px",
            background: "#2d2d2d",
            color: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            opacity:0.3
        }}
        >
        {label}
        </div>
    );
}

/**
 * Offset for the drag overlay.
 * @returns 
 */
const offsetOverlay = ({ transform }) => {
  return {
    ...transform,
    x: transform.x + 20,
    y: transform.y + 20
  };
};

/**
 * Root node for the layout tree. This component will start 
 * rendering the tree and it will also watch for changes in the
 * root container sizes to process layout changes.
 * 
 * @return {React.ReactElement}
 */
export const RootContainer = () => {
    const controller = useLayoutController();

    const rootRef = useRef(null);
    const timerRef = useRef(null);
    const resizingRef = useRef(false);
    
    // Create the container API that will be used by the controller.
    const rootContainerAPI = useRef({});
    rootContainerAPI.current = {};

    const [childElements, setChildElements] = useState(null);
    
    /**
     * Renders child containers recursively.
     */
    const processContainer = useCallback((node) => {
        const childElements = [];      
        for (let index = 0; index < node.children.length; index++) {
            const childNode = node.children[index];

            if (childNode.type === "container") {
                const child = controller.ldf.containers[node.children[index].containerId];
                child.parent = node;
                childElements.push(
                    <Container key={index} meta={node.children[index]} id={child.id} node={child}/>
                );
            } else if (childNode.type === "handleBar") {
                if (node.orientation === "horizontal") {
                    childElements.push(
                        <HandleBar 
                            key={index}
                            orientation="vertical" 
                            parent={node.id}
                            sibling1={childNode.sibling1}
                            sibling2={childNode.sibling2}
                        />
                    );
                } else if (node.orientation === "vertical") {
                    childElements.push(
                        <HandleBar 
                            key={index}
                            orientation="horizontal" 
                            parent={node.id}
                            sibling1={childNode.sibling1}
                            sibling2={childNode.sibling2}
                        />
                    );
                }
            }
        };
        return childElements;
    },[controller]);


    useLayoutEffect(() => {
        if (controller) {            
            const rootNode = controller.ldf.containers[controller.ldf.layoutRoot];
            const hasChildren = rootNode.children && rootNode.children.length > 0
            controller.registerContainer(rootNode.id, rootContainerAPI, rootRef.current);

            if (hasChildren) {                          
                if (rootNode.orientation === "horizontal") {
                    rootRef.current.style.flexDirection = "row";
                } else if (rootNode.orientation === "vertical") {
                    rootRef.current.style.flexDirection = "column";
                }
            }

            setChildElements(hasChildren?processContainer(rootNode):null);

            // Create resize observer to monitor changes in the root container size.
            const observer = new ResizeObserver((entries) => {

                if (!resizingRef.current) resizingRef.current = true;

                for (let entry of entries) {
                    const { width, height } = entry.contentRect;

                    clearTimeout(timerRef.current);

                    timerRef.current = setTimeout(() => {
                        resizingRef.current = false;
                        controller.handleRootResize(width, height);
                    }, 1);
                }
            });

            observer.observe(rootRef.current);

            return () => {
                controller.unregisterContainer(controller.ldf.layoutRoot);
                observer.disconnect();
            }
        }
    }, [controller]);

    /**
     * Callback for when drag ends.
     */
    const handleDragEnd = (event) =>{
        const { active, over } = event;
        console.log("Drag Ended");
        if (over) {
            console.log("Dragged item:", active.id);
            console.log("Dropped on:", over.id);
        } else {
            console.log("Dropped outside any droppable");
        }
    }

    /**
     * Callback for when drag is started.
     */
    const onDragStart = (event) => {
        console.log("Drag Started");
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8
            }
        })
    );

    return (
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={handleDragEnd}>
            <div className="root-container">
                <div ref={rootRef} className="relative-container">
                    {childElements}
                </div>
            </div>
            <DragOverlay modifiers={[offsetOverlay]} dropAnimation={null}>
                <DragPreview label={"preview"}/>
            </DragOverlay>
        </DndContext>
    );
}