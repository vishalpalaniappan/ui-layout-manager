
/**
 * This class exposes functions that allow the containers to register themselves
 * with the controller. It also creates a worker to execute layout related tasks 
 * and exposes functionality to update the container sizes with the updated values.
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
        this.worker = new Worker(new URL('./LayoutWorker.js', import.meta.url));
        this.worker.onmessage = this.handleWorkerMessage.bind(this);
        this.worker.postMessage("hello");
    }


    /**
     * Sets the layout tree used to render the containers.
     * @param {Object} tree 
     */
    setLayoutTree(tree) {
        this.ldf = tree;
    }


    /**
     * Sets the registry used to lazy load the components
     * @param {Object} registry 
     */
    setRegistry(registry) {
        this.registry = registry;
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
    }

    /**
     * Say hello! 
     */
    sayHello() {
        console.log("hello");
    }
}