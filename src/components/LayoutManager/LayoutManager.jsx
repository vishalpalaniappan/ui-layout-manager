import "./LayoutManager.scss";
import PropTypes from 'prop-types';


/**
 * Renders the layout.
 * 
 * @param {Object} layout 
 * @return {JSX}
 */
export const LayoutManager = ({layout}) => {
    
    return (
        // TEMPORARY
        <div style={{"backgroundColor":"black","width":"100%","height":"100%"}}>
            <div style={{"color":"white"}}>
                Placeholder Text
            </div>
        </div>
    );
}

LayoutManager.propTypes = {
    layout: PropTypes.object,
}