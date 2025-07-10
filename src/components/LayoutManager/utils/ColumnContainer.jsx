import PropTypes from 'prop-types';

/**
 * Renders the ColumnContainer.
 * 
 * @param {Object|Array} children 
 * @param {String} width eg. 50%, in the future, I will set the width
 * in pixels for some panels, so I kept the logic which generates the size
 * in the component above this and accept a formatted string.
 * @return {JSX}
 */
export const ColumnContainer = ({children, width}) => {
    return (
        <div
            style={{
                "float":"left",
                "width": width,
                "height": "100%",
            }}> 
                {children }
        </div>
    );
}

ColumnContainer.propTypes = {
    width: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.object,PropTypes.array])
}