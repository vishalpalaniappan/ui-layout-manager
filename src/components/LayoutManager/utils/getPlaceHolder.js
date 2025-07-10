import { useRef } from "react";
import "./styles.scss";

export function getPlaceHolder(node) {
    // TODO: Move to stylesheet
    const outerDiv =  {
        "width": "100%",
        "height": "100%",
        "backgroundColor": "#222",
        "position": "relative",
        "fontFamily":"Roboto"
    }

    const innerDiv = {
        "position": "absolute",
        "top": "2px",
        "left": "2px",
        "right": "2px",
        "bottom": "2px",
        "backgroundColor": "#111",
        "display": "flex",
        "justifyContent": "center",
        "alignItems": "center",
        "color":"#BBB"
    }
   
    return  <div style={outerDiv}>
        <div  className="hoverDiv" style={innerDiv}>
            {node.id}
        </div>
    </div>
}