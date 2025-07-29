import { LayoutEditor } from "./LayoutEditor";
import LAYOUT_WORKER_PROTOCOL from "./LAYOUT_WORKER_PROTOCOL";

/**
 * This function receives messages from the main thread and executes
 * the layout manipulation logic.
 * @param {Object} e 
 */
let editor;
self.onmessage = function (e) {

    console.log(e.data);   
    try {
        const args = e.data.args;
        switch (e.data.code) {
            case LAYOUT_WORKER_PROTOCOL.INITIALIZE:
                /** @type {LayoutEditor} */
                editor = new LayoutEditor(e.data.args.ldf);
                break;
            case LAYOUT_WORKER_PROTOCOL.RENDER_NODE:
                const d = e.data.args;
                editor.processTree(d.id, d.width, d.height);
                break;
            default:
                break;
        }

    } catch (e) {
        console.error(e);
    }
}