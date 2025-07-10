import { RowContainer } from "./RowContainer";
import { ColumnContainer } from "./ColumnContainer";
import { getPlaceHolder } from "./getPlaceHolder";

let panelCount = 0;

/**
 * Generates the containers given a JSON
 * layout definition.
 * @param {Object} jsonLayout 
 * @returns 
 */
export function generateContainers(jsonLayout) {
    panelCount = 0;
    return processContainer(jsonLayout.layout)
}

/**
 * Processes children if they exist, if not,
 * it returns a placeholder for the UI.
 * @param {Object} panel 
 * @returns 
 */
const checkForChildren = (panel) => {
    if ("children" in panel && panel.children.length > 0) {
        return processContainer(panel.children);
    } else {
        return getPlaceHolder(panel, ++panelCount);
    }
}

/**
 * Recursively processes the JSON layout document and 
 * generates the containers. 
 * @param {Object} container 
 * @returns {Array} 
 */
const processContainer = (container) => {

    const containers = [];

    container.forEach((panel, index) => {
        if (panel.type == "row") {
            containers.push(
                <RowContainer key={panel.id} height={panel.height + "%"}>
                    {checkForChildren(panel)}
                </RowContainer>
            );
        } else if (panel.type == "column") {
            containers.push(
                <ColumnContainer key={panel.id} width={panel.width + "%"}>
                    {checkForChildren(panel)}
                </ColumnContainer>
            );
        }
    });

    return containers;

}
