import PropTypes from 'prop-types';

import "./PlaceHolder.scss"

/**
 * Renders the Placeholder.
 * 
 * This is a temporary component and it will replaced
 * with the component specified in the LDF file.
 * 
 * @param {Object} panel
 * @return {JSX}
 */
export const PlaceHolder = ({panel}) => {

    const outerDiv =  {
        "width": "100%",
        "height": "100%",
        "backgroundColor": "#1e1e1e",
        "position": "relative",
        "fontFamily":"Roboto"
    }

    const innerDiv = {
        "position": "absolute",
        "top": "2px",
        "left": "2px",
        "right": "2px",
        "bottom": "2px",
        "display": "flex",
        "justifyContent": "center",
        "alignItems": "center",
        "color":"#BBB"
    }
    return (
        <div style={outerDiv}>
            <div className="hoverDiv" style={innerDiv}>
                {panel.id}
            </div>
        </div>
    );
}

PlaceHolder.propTypes = {
    panel: PropTypes.object,
}