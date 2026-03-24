import PropTypes from 'prop-types';

import {XLg} from "react-bootstrap-icons";
import "./Tabs.scss"

/**
 * Tabs component for the containers.
 * 
 * @param {Object} node
 */
export const Tabs = ({tabs, onTabClick}) => {
    return (
        <div className="container-tabs-row">
            <div className="container-tabs">
            {tabs.map((tab, index) => (
                <div 
                    key= {tab.name + String(index)}
                    style={{ borderBottom: tab.selected ? "solid 1px white" : "none" }}
                    onClick={(e) => onTabClick(tab)} 
                    className="container-tab">
                    {tab.name}
                </div>
            ))}
            </div>

            <div className="container-close">
                <XLg/>
            </div>
        </div>
    );
}

Tabs.propTypes = {
    tabs: PropTypes.array,
}