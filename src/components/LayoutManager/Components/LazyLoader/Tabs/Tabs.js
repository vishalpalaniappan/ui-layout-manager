import PropTypes from 'prop-types';

import {XLg} from "react-bootstrap-icons";
import "./Tabs.scss"

import { useLayoutController } from "../../../Providers/LayoutProvider";

/**
 * Tabs component for the containers.
 * 
 * @param {Object} node
 */
export const Tabs = ({node, onTabClick}) => {
    const controller = useLayoutController();

    const closeContainer = () => {
        controller.invokeAction({
            id: node?.tabsBar?.closeContainerId,
            action: "close",
            args: {},
        });
    };

    return (
        <div className="container-tabs-row">
            <div className="container-tabs">
            {node?.tabsBar?.tabs?.map((tab, index) => (
                <div 
                    key= {tab.name + String(index)}
                    style={{ borderBottom: tab.selected ? "solid 1px white" : "none" }}
                    onClick={(e) => onTabClick(tab)} 
                    className="container-tab">
                    {tab.name}
                </div>
            ))}
            </div>

            {
                node?.tabsBar?.showClose && 
                <div className="container-close">
                    <XLg onClick={closeContainer}/>
                </div>
            }
        </div>
    );
}

Tabs.propTypes = {
    node: PropTypes.object,
    onTabClick: PropTypes.func
}