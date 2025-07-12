import { useEffect, useState } from "react";
import "./LayoutManager.scss";
import PropTypes from 'prop-types';
import { RowContainer } from "./components/RowContainer";
import { ColumnContainer } from "./components/ColumnContainer";
import { Container } from "./components/Container";


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