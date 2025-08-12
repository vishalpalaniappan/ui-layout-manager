import React, { useEffect, useState, useRef, createContext, useContext } from "react";
import PropTypes from 'prop-types';
import { Container } from "../Container/Container";
import { useLayoutController } from "../../Providers/LayoutProvider";

import "./RootContainer.scss"
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
    
    const [rootNode, setRootNode] = useState(null);
    const [resizing, setResizing] = useState(false);

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;

        const observer = new ResizeObserver(entries => {

            if (!resizing) setResizing(true);
            
            for (let entry of entries) {
                const { width, height } = entry.contentRect;

                clearTimeout(timerRef.current);

                controller.handleRootResize(width, height);

                timerRef.current = setTimeout(() => {
                    resizeDone(width, height);
                }, 200);
            }
        });

        observer.observe(el);

        return () => observer.disconnect();
    }, []);


    /**
     * Called when the resize event is done.
     * @param {Number} width 
     * @param {Number} height 
     */
    const resizeDone = (width, height) => {
        // Setting up function for future.
    }

    useEffect(() => {
        if (controller) {
            setRootNode(controller.ldf.containers[controller.ldf.layoutRoot]);
        }
    }, [controller]);

    return (
        <div ref={rootRef} className="background">
            {
                rootNode && 
                <Container node={rootNode} meta={controller.ldf.layoutRoot} id={rootNode.id}/>
            }
        </div>
    );
}

RootContainer.propTypes = {
    ldf: PropTypes.object,
}