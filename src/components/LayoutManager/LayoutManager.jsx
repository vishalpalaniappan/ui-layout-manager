import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Container } from "./Components/Container/Container";

import "./LayoutManager.scss";

/**
 * Renders the layout.
 * 
 * @param {Object} ldf 
 * @return {JSX}
 */
export const LayoutManager = ({ldf}) => {
    const [rootContainer, setRootContainer] = useState(<></>);  
    
    const processLayout = (layout) => {
        setRootContainer(<Container layout={layout}/>);
    }

    useEffect(() => {
        if (ldf) {
            processLayout(ldf.layout);
        }
    }, [ldf]);

    return (
        <div className="background">
            {rootContainer}
        </div>
    );
}

LayoutManager.propTypes = {
    ldf: PropTypes.object,
}