import PropTypes, { node } from "prop-types";

import "./MenuBar.scss";

import { XLg } from "react-bootstrap-icons";

import { useLayoutController } from "../../../Providers/LayoutProvider";

/**
 * MenuBar component for the containers.
 *
 * @param {Object} node
 */
export const MenuBar = ({ node }) => {
    const controller = useLayoutController();

    const closeContainer = () => {
        controller.invokeAction({
            id: node.id,
            action: "close",
            args: {},
        });
    };

    return (
        <div className="titleContainer">
            <div className="title">{node.title}</div>
            <div onClick={closeContainer} className="close">
                <XLg />
            </div>
        </div>
    );
};

MenuBar.propTypes = {
    content: PropTypes.object,
};
