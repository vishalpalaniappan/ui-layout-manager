import { LayoutEditor } from "./LayoutEditor";
import LAYOUT_WORKER_PROTOCOL from "./LAYOUT_WORKER_PROTOCOL";

/**
 * This function receives messages from the main thread and executes
 * the layout manipulation logic.
 * @param {Object} e 
 */
let editor;
self.onmessage = function (e) {

    try {
        const args = e.data.args;
        switch (e.data.code) {
            case LAYOUT_WORKER_PROTOCOL.INITIALIZE:
                /** @type {LayoutEditor} */
                editor = new LayoutEditor(args.ldf);
                break;
            case LAYOUT_WORKER_PROTOCOL.INITIALIZE_FLEXBOX:
                editor.initializeFlexBox();
                break;
            case LAYOUT_WORKER_PROTOCOL.APPLY_SIZES:
                editor.applySizes(args.sizes);
                break;
            default:
                break;
        }

    } catch (e) {
        postMessage({
            type: LAYOUT_WORKER_PROTOCOL.ERROR,
            error: {
                message: e.message,
                stack: e.stack
            }
        });
    }
}