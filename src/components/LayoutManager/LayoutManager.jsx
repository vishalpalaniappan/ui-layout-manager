import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Container } from "./components/Container/Container";

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
        setRootContainer(<Container type={layout.childType} childContainers={layout.children}/>);
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