import React, { useEffect, useState, useRef, createContext, useContext } from "react";
import PropTypes from 'prop-types';
import { Container } from "../Container/Container";
import { useLayoutController } from "../../Providers/LayoutProvider";

import "./RootContainer.scss"
/**
 * Root container of the layout tree. This component will start 
 * rendering the tree and it will also watch for changes in the
 * root container sizes to process layout changes.
 * 
 * @param {Object} layout The layout of this container including its children.
 * @return {React.ReactElement}
 */
export const RootContainer = ({layout}) => {
    const controller = useLayoutController();

    const rootRef = useRef(null);
    const timerRef = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    let layoutUpdateScheduled = false;
    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;

        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;

                if (!layoutUpdateScheduled) {
                    layoutUpdateScheduled = true;
                    setTimeout(() => {
                        controller.addLayoutEvent(["root",width, height]);
                        layoutUpdateScheduled = false;
                    }, 16);
                }
            }
        });

        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={rootRef} className="background">
            <Container layout={layout} />
        </div>
    );
}

RootContainer.propTypes = {
    ldf: PropTypes.object,
}