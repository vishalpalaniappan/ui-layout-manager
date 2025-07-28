
/**
 * @class LayoutController
 */
export class LayoutController {

    /**
     * Constructor
     */
    constructor() {
        this.containers = {};
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
     * Say hello! 
     */
    sayHello() {
        console.log("hello");
    }
}