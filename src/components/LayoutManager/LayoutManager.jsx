import "./LayoutManager.scss";
import PropTypes from 'prop-types';


/**
 * Renders the layout.
 * 
 * @param {Object} layout 
 * @return {JSX}
 */
export const LayoutManager = ({layout}) => {
    console.log(layout);
    const text = "Placeholder Textasdf"
    return (
        // TEMPORARY
        <div className="sample">
            {text}
        </div>
    );
}

LayoutManager.propTypes = {
    layout: PropTypes.object,
}