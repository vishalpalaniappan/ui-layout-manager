import React, { lazy, useMemo, Suspense, useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import ComponentRegistryContext from "../../Providers/ComponentRegistryContext";
import { MenuBar } from "./MenuBar/MenuBar";
import { Tabs } from "./Tabs/Tabs";

import "./LazyLoader.scss"

/**
 * LazyLoader component that renders a component
 * specified in the ldf file.
 * 
 * @param {Object} content
 */
export const LazyLoader = ({node}) => {
    const registry = useContext(ComponentRegistryContext);
    const [showTitle, setShowTitle] = useState(false);
    const [showTab, setShowTab] = useState(false);

    const [lazyContainerTop, setLazyContainerTop] = useState(0);
    const [tabsTop, setTabsTop] = useState(0);
    const [selectedComponent, setSelectedComponent] = useState("");

    const LazyComponent = useMemo(() => {
        if (registry && selectedComponent in registry) {
            return lazy(registry[selectedComponent]);
        }
    }, [registry, selectedComponent]);

    /**
     * Note: I am setting the top of the absolute position
     * of the containers based on if the title and tabs are
     * shown. This is a temporary implementation, I will be
     * revisiting this and formally implementing it after.
     */
    useEffect(() => {
        let _lazyContainerTop = 0;
        let _tabsTop = 0;
        if ("title" in node) {
            setShowTitle(true);
            _tabsTop += 35;
            _lazyContainerTop += 35;
        }
        if ("tabs" in node) {
            setShowTab(true);
            _lazyContainerTop += 35;
            selectTab(node.tabs[0]);
        } else {
            setSelectedComponent(node.component);
        }
        setLazyContainerTop(_lazyContainerTop)
        setTabsTop(_tabsTop);
    }, [node]);

    const selectTab = (selectedTab) => {
        node.tabs.forEach((tab) => {
            if (tab === selectedTab) {
                tab.selected = true;
                setSelectedComponent(tab.component);
            } else {
                tab.selected = false;
            }
        });
    }

    return (
        <div className="absoluteContainer">
            <div className="contentContainer">
                {
                    showTitle && 
                        <div className="menuContainer">
                            <MenuBar title={node.title}/>
                        </div>
                }
                {
                    showTab && 
                        <div className="tabsContainer" style={{ top: `${tabsTop}px`}}>
                            <Tabs onTabClick={selectTab} tabs={node.tabs}/>
                        </div>
                }
                <div className="lazycontainer" style={{ top: `${lazyContainerTop}px`}}>
                    <Suspense fallback={<div>Loading...</div>}>
                        {LazyComponent && <LazyComponent />}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

LazyLoader.propTypes = {
    content: PropTypes.object,
}