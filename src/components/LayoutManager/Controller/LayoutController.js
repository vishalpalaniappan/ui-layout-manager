import LAYOUT_WORKER_PROTOCOL from "./LAYOUT_WORKER_PROTOCOL";

/**
 * This controller is responsible for managing the layout of the application.
 * - It will handle the registration and unregistration of containers.
 * - It will handle the layout changes and notify the worker to process the layout changes.
 * - It will update the container sizes with the updated values calculated by the worker.
 * 
 * @class LayoutController
 */
export class LayoutController {

    /** 
     * Constructor
     * 
     * @param {Object} ldf - Layout Definition JSON object
     */
    constructor(ldf) {
        this.containers = {};
        this.containerRefs = {};
        this.ldf = ldf;
        this.numberOfContainers = 0;
        this.registeredContainers = 0;
        this.layoutLoaded = false;

        this.numberOfContainers = this.ldf.containers ? Object.keys(this.ldf.containers).length + 1: 0;

        try {
            this.worker = new Worker(
                new URL('./LayoutWorker.js', import.meta.url),
                { type: 'module' }
            );
            this.worker.onmessage = this.handleWorkerMessage.bind(this);
            this.worker.onerror = (error) => console.error('Worker error:', error);
            this.sendToWorker(LAYOUT_WORKER_PROTOCOL.INITIALIZE, {ldf: ldf})
            
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
     * Allows containers to register themselves with the controller.
     * @param {String} id 
     * @param {Object} containerApi 
     * @param {HTMLElement} containerRef 
     */
    registerContainer(id, containerApi, containerRef) {        
        if (!(id in this.containers)) {
            this.registeredContainers += 1
        }
 
        this.containers[id] = containerApi;
        this.containerRefs[id] = containerRef;

        console.log(`Registered container with id: ${id} `);

        if (this.registeredContainers === this.numberOfContainers && !this.layoutLoaded) {
            console.log("All containers registered, layout is ready.");
            this.layoutLoaded = true;
            const size = this.containerRefs["root"].getBoundingClientRect();
            const id = this.ldf.containers[this.ldf.layoutRoot].id;
            this.sendToWorker(
                LAYOUT_WORKER_PROTOCOL.RENDER_NODE, 
                { id: id, size: size }
            );
        }
    }
    
    /**
     * Allows containers to unregister themselves with the controller.
     * @param {String} id 
     */
    unregisterContainer(id) {
        delete this.containers[id];
    }

    /**
     * This function is called when the root container is resized.
     * It will notify the worker to process the layout changes.
     * @param {Number} width 
     * @param {Number} height 
     */
    handleRootResize(width, height) {

    }

    /**
     * Handles messages from worker
     * @param {Object} event 
     */
    handleWorkerMessage(event) {
        const data = event.data;
        switch(data.type) {
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
    }
}