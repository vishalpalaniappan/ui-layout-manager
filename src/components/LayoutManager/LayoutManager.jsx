import { useEffect, useState } from "react";
import "./LayoutManager.scss";
import PropTypes from 'prop-types';
import {generateContainers} from "./utils/generateContainersFromJSON";


/**
 * Renders the layout.
 * 
 * @param {Object} layout 
 * @return {JSX}
 */
export const LayoutManager = ({layout}) => {
    const [containers, setContainers] = useState(<></>);  

    useEffect(() => {
        if (layout) {
            setContainers(generateContainers(layout));
        }
    }, [layout]);

    return (
        <div className="background">
            {containers}
        </div>
    );
}

LayoutManager.propTypes = {
    layout: PropTypes.object,
}