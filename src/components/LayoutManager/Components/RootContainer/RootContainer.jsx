import React, { useEffect, useLayoutEffect, useState, useRef, useCallback, useContext } from "react";
import PropTypes from 'prop-types';
import { Container } from "../Container/Container";
import { HandleBar } from "../HandleBar/HandleBar";
import { useLayoutController } from "../../Providers/LayoutProvider";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";

import useDragEventController from "./DragController";
import "./RootContainer.scss"


/**
 * Root node for the layout tree. This component will start 
 * rendering the tree and it will also watch for changes in the
 * root container sizes to process layout changes.
 * 
 * @return {React.ReactElement}
 */
export const RootContainer = () => {
    const layoutController = useLayoutController();
    const dragController = useDragEventController();

    const rootRef = useRef(null);
    const timerRef = useRef(null);
    const resizingRef = useRef(false);
    const loadingOverlayRef = useRef(null);
    const [showLoadingScreen, setShowLoadingScreen] = useState(true);

    // Create the container API that will be used by the controller.
    const rootContainerAPI = useRef({});
    rootContainerAPI.current = {
        hideLoadingScreen: () => {
            if (showLoadingScreen) {
                setShowLoadingScreen(false);
            }
        }
    };

    const [childElements, setChildElements] = useState(null);

    /**
     * Renders child containers recursively.
     */
    const processContainer = useCallback((node) => {
        const childElements = [];
        for (let index = 0; index < node.children.length; index++) {
            const childNode = node.children[index];

            if (childNode.type === "container") {
                const child = layoutController.ldf.containers[node.children[index].containerId];
                child.parent = node;
                childElements.push(
                    <Container key={index} meta={node.children[index]} id={child.id} node={child} />
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
    }, [layoutController]);


    useLayoutEffect(() => {
        if (layoutController) {
            const rootNode = layoutController.ldf.containers[layoutController.ldf.layoutRoot];
            const hasChildren = rootNode.children && rootNode.children.length > 0
            layoutController.registerContainer(rootNode.id, rootContainerAPI, rootRef.current);

            if (hasChildren) {
                if (rootNode.orientation === "horizontal") {
                    rootRef.current.style.flexDirection = "row";
                } else if (rootNode.orientation === "vertical") {
                    rootRef.current.style.flexDirection = "column";
                }
            }

            setChildElements(hasChildren ? processContainer(rootNode) : null);

            // Create resize observer to monitor changes in the root container size.
            const observer = new ResizeObserver((entries) => {

                if (!resizingRef.current) resizingRef.current = true;

                for (let entry of entries) {
                    const { width, height } = entry.contentRect;

                    clearTimeout(timerRef.current);

                    timerRef.current = setTimeout(() => {
                        resizingRef.current = false;
                        layoutController.handleRootResize(width, height);
                    }, 1);
                }
            });

            observer.observe(rootRef.current);

            return () => {
                layoutController.unregisterContainer(layoutController.ldf.layoutRoot);
                observer.disconnect();
            }
        }
    }, [layoutController]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8
            }
        })
    );

    // Manually track the drag position for smooth overlay
    const [dragPos, setDragPos] = useState({ left: 0, top: 0 });
    useEffect(() => {
        if (!dragController.isDragging()) return;
        const handleMove = (e) => {setDragPos({ left: e.clientX, top: e.clientY })};
        window.addEventListener("pointermove", handleMove);
        return () => {
            window.removeEventListener("pointermove", handleMove);
        };
    }, [dragController.isDragging()]);

    return (
        <DndContext sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={dragController.onDragStart}
            onDragOver={dragController.onDragOver}
            onDragEnd={dragController.onDragEnd}
            onDragCancel={dragController.onDragCancel}>
            
            {showLoadingScreen && <div className="loading-overlay" ref={loadingOverlayRef}>
                <div className="loading-bar">
                    <div className="loading-bar-fill"></div>
                </div>
            </div>}
            <div className="root-container">
                <div ref={rootRef} className="relative-container">
                    {childElements}
                </div>
            </div>

            {dragController.isDragging() && (
                <div className="drag-overlay" style={dragPos}>
                    {dragController.getDragPreview()}
                </div>
            )}
        </DndContext>
    );
}