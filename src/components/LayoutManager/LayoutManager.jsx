import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Container } from "./Components/Container/Container";

import "./LayoutManager.scss";

/**
 * Renders the layout specified in the LDF file.
 * 
 * @param {Object} ldf JSON object containing the Layout Definition File (LDF)
 * @return {JSX}
 */
export const LayoutManager = ({ldf}) => {
    const [rootContainer, setRootContainer] = useState(<></>);  

    useEffect(() => {
        if (ldf) {
            setRootContainer(<Container layout={ldf.layout}/>);
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