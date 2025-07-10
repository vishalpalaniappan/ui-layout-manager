import { RowContainer } from "./RowContainer";
import { ColumnContainer } from "./ColumnContainer";
import { getPlaceHolder } from "./getPlaceHolder";

/**
 * Generates the containers given a JSON
 * layout definition.
 * @param {Object} jsonLayout 
 * @returns 
 */
export function generateContainers(jsonLayout) {
    return processContainer(jsonLayout.layout)
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
                    {
                        panel.children.length > 0 ? 
                        processContainer(panel.children):
                        getPlaceHolder(panel)
                    }
                </RowContainer>
            );
        } else if (panel.type == "column") {
            containers.push(
                <ColumnContainer key={panel.id} width={panel.width + "%"}>
                    {
                        panel.children.length > 0 ? 
                        processContainer(panel.children):
                        getPlaceHolder(panel)
                    }
                </ColumnContainer>
            );
        }
    });

    return containers;

}
