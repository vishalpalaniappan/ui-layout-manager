import PropTypes from 'prop-types';

import "./Tabs.scss"

/**
 * Tabs component for the containers.
 * 
 * @param {Object} node
 */
export const Tabs = ({tabs, onTabClick}) => {



    return (
        <div className="container-tabs-row">
            {tabs.map((tab) => (
                <div 
                    style={{ borderBottom: tab.selected ? "solid 1px white" : "none" }}
                    onClick={(e) => onTabClick(tab)} 
                    className="container-tab">
                    {tab.name}
                </div>
            ))}
        </div>
    );
}

Tabs.propTypes = {
    tabs: PropTypes.object,
}