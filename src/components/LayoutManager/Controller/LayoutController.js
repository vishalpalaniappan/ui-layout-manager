/**
 * This class exposes functions that allow the containers to register and unregister
 * themselves with the controller. It also creates a worker to execute layout related  
 * tasks and exposes functionality to update the container sizes with the updated values.
 * 
 * This class currently only contains the skeleton, more functionality will be added soon.
 * 
 * @class LayoutController
 */
export class LayoutController {

    /**
     * Constructor
     */
    constructor() {
        this.containers = {};

        try {
            this.worker = new Worker(
                new URL('./LayoutWorker.js', import.meta.url),
                { type: 'module' }
            );
            this.worker.onmessage = this.handleWorkerMessage.bind(this);
            this.worker.onerror = (error) => console.error('Worker error:', error);
            this.worker.postMessage("hello");
        } catch (error) {
            console.error('Failed to create worker:', error);
        }
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
        console.log(data);
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