import { LayoutEditor } from "./LayoutEditor";

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
            case "INIT":
                editor = new LayoutEditor(e.data.args.ldf);
                break;
            case "SIZE":
                const d = e.data.args;
                editor.processTree(d.id, d.width, d.height);
                break;
            case "HELLO":
                self.postMessage("hello from worker!")
                break;
            default:
                break;
        }

    } catch (e) {
        console.error(e);
    }
}