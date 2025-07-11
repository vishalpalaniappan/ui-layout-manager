import { useEffect, useState } from "react";
import "./LayoutManager.scss";
import PropTypes from 'prop-types';
import { RowContainer } from "./components/RowContainer";
import { ColumnContainer } from "./components/ColumnContainer";


/**
 * Renders the layout.
 * 
 * @param {Object} ldf 
 * @return {JSX}
 */
export const LayoutManager = ({ldf}) => {
    const [rootContainer, setRootContainer] = useState(<></>);  
    
    const processLayout = (layout) => {
        if (layout.childType === "column") {
            setRootContainer(<ColumnContainer childContainers={layout.children}/>);
        } else if (layout.childType === "row") {
            setRootContainer(<RowContainer childContainers={layout.children}/>);
        }
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