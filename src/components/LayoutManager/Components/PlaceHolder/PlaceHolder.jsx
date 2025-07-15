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
        "color":"grey",
        "fontSize": "12px",
        "fontFamily":"Arial, Helvetica, sans-serif"
    }
    return (
        <div style={outerDiv}>
            <div className="hoverDiv" style={innerDiv}>
                {panel.description}
            </div>
        </div>
    );
}

PlaceHolder.propTypes = {
    panel: PropTypes.object,
}