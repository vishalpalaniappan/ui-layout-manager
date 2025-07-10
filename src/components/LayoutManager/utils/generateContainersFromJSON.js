import { Container } from "./Container";
import { RowContainer } from "./RowContainer";
import { ColumnContainer } from "./ColumnContainer";

export function generateContainers(jsonLayout) {
    const layout = jsonLayout.layout;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const containers = [];

    const el = <div style={{width:"100%",height:"100%"}}>
        {processContainer(layout)}
    </div>

    return el;
}

const getPlaceHolder = (node) => {

    const outer =  {
        "width": "100%",
        "height": "100%",
        "background-color": "#111",
        "position": "relative"
    }

    const inner = {
        "position": "absolute",
        "top": "3px",
        "left": "3px",
        "right": "3px",
        "bottom": "3px",
        "background-color": "#222",
        "display": "flex",
        "justify-content": "center",
        "align-items": "center",
    }
   
    return  <div style={outer}>
        <div style={inner}>
            {node.id}
        </div>
    </div>
}

const processContainer = (container) => {

    console.log("Container:", container);

    const conts = [];

    container.forEach((node, index) => {

        if (node.type == "row") {
            console.log("Rendering row", node);
            const el = <RowContainer 
                key={node.id}
                id={node.id}
                width={"100%"}
                height={node.height + "%"}
                type={node.childType}
            >
                {node.children.length > 0 ? processContainer(node.children):getPlaceHolder(node)}
                
            </RowContainer>
            
            conts.push(el);
        }

        if (node.type == "column") {
            console.log("Rendering column", node);
            const el = <ColumnContainer
                key={node.id}
                id={node.id}
                height={"100%"}
                width={node.width + "%"}
                type={node.childType}
            >
                {node.children.length > 0 ? processContainer(node.children):getPlaceHolder(node)}
            </ColumnContainer>
            conts.push(el);
        }

    });

    return conts;

}
