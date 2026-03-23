import PropTypes from 'prop-types';

import "./MenuBar.scss"

/**
 * MenuBar component for the containers.
 * 
 * @param {Object} node
 */
export const MenuBar = ({title}) => {

    return (
        <div className="titleContainer">
            <div className="title">{title}</div>
        </div>
    );
}

MenuBar.propTypes = {
    content: PropTypes.object,
}