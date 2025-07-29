import LAYOUT_WORKER_PROTOCOL from "./LAYOUT_WORKER_PROTOCOL";

/**
 * This class exposes functions that allow the containers to register and unregister
 * themselves with the controller. It also creates a worker to execute layout related  
 * tasks and exposes functionality to update the container sizes with the updated values.
 * 
 * @class LayoutController
 */
export class LayoutController {

    /**
     * Constructor
     * 
     * @param {Object} layout - Layout Definition JSON object
     */
    constructor(layout) {
        this.containers = {};
        this.ldf = layout;

        try {
            this.worker = new Worker(
                new URL('./LayoutWorker.js', import.meta.url),
                { type: 'module' }
            );
            this.worker.onmessage = this.handleWorkerMessage.bind(this);
            this.worker.onerror = (error) => console.error('Worker error:', error);
            this.sendToWorker(LAYOUT_WORKER_PROTOCOL.INITIALIZE, {ldf: layout})
            
        } catch (error) {
            console.error('Failed to create worker:', error);
        }
    }

    /**
     * Sends message to worker with the provided arguments.
     * @param {Number} code 
     * @param {Object} args 
     */
    sendToWorker(code, args) {
        this.worker.postMessage({
            code:code,
            args: args
        });
    }

    /**
     * Sets the layout tree used to render the containers.
     * @param {Object} tree 
     */
    setLayoutTree(tree) {
        this.ldf = tree;
    }

    /**
     * Allows containers to register themselves with the controller.
     * @param {String} id 
     * @param {Object} containerApi 
     */
    registerContainer(id, containerApi) {
        this.containers[id] = containerApi;
        if (id === "root") {
            const bounds = containerApi.getSize();
            this.processTreeFromId(id, bounds.width, bounds.height);
        }
    }

    /**
     * Process the layout information for the subtree
     * of the node with the provided id. The starting
     * width and height are provided for the calculations.
     * @param {String} id 
     * @param {Number} width 
     * @param {Number} height 
     */
    processTreeFromId(id, width, height) {
        this.sendToWorker(
            LAYOUT_WORKER_PROTOCOL.RENDER_NODE, 
            {
                id: id,
                width:width,
                height:height
            }
        );
    }
    
    /**
     * Allows containers to unregister themselves with the controller.
     * @param {String} id 
     */
    unregisterContainer(id) {
        delete this.containers[id];
    }

    /**
     * Handles messages from worker
     * @param {Object} event 
     */
    handleWorkerMessage(event) {
        const data = event.data;
        console.log(data, this.containers);
        switch(data.type) {
            case "style":
                console.log("setting style");
                const container = this.containers[data.parentId];
                console.log(container);
                break;
            default:
                break;
        }
    }

    /**
     * Performs cleanup when the controller is destroyed.
     */
    destroy() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
        this.containers = {};
    }

    /**
     * Say hello! 
     */
    sayHello() {
        console.log("hello");
    }
}