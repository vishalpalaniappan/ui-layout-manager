
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
     * Allows containers to register themselves with the controller.
     * @param {String} id 
     * @param {Object} containerApi 
     */
    registerContainer(id, containerApi) {
        this.containers[id] = containerApi;
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
     * Say hello! 
     */
    sayHello() {
        console.log("hello");
    }
}