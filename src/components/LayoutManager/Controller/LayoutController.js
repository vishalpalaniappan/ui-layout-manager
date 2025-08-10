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
     * @param {Object} ldf - Layout Definition JSON object
     */
    constructor(ldf) {
        this.containers = {};
        this.containerRefs = {};
        this.ldf = ldf;
        this.numberOfContainers = 0;
        this.registeredContainers = 0;
        this.layoutLoaded = false;

        this.getNumberOfContainers(ldf.layout);

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
     * Counts the number of containers in the LDF file.
     * @param {Object} node 
     */
    getNumberOfContainers (node) {
        this.numberOfContainers += 1;
        if (node.children && node.children.length > 0) {
            for (const child of node.children) {
                this.getNumberOfContainers(child)
            }
        }
    };

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
        if (id in this.containers) {
            this.containers[id] = containerApi;
            this.containerRefs[id] = containerRef;
        } else {
            this.containers[id] = containerApi;
            this.containerRefs[id] = containerRef;
            this.registeredContainers += 1
        }

        if (this.registeredContainers === this.numberOfContainers) {
            this.layoutLoaded = true;
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