import PropTypes from 'prop-types';

import "./MenuBar.scss"

import {XLg} from "react-bootstrap-icons";

/**
 * MenuBar component for the containers.
 * 
 * @param {Object} node
 */
export const MenuBar = ({title}) => {

    return (
        <div className="titleContainer">
            <div className="title">
                {title}
            </div>
            <div className="close">
                <XLg/>
            </div>
        </div>
    );
}

MenuBar.propTypes = {
    content: PropTypes.object,
}