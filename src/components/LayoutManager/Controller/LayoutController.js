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
        this.ldf = ldf;
        this.numberOfContainers = 0;
        this.registeredContainers = 0;
        this.layoutLoaded = false;

        this.scheduled = false;

        this.events = [];

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
        if (id in this.containers) {
            this.containers[id] = containerApi;
        } else {
            this.containers[id] = containerApi;
            this.registeredContainers += 1
        }
        if (this.registeredContainers === this.numberOfContainers) {
            const bounds = this.containers["root"].getSize();
            this.processTreeFromId("root", bounds.width, bounds.height);
            this.layoutLoaded = true;
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
        if (this.layoutLoaded) {
            this.sendToWorker(
                LAYOUT_WORKER_PROTOCOL.RENDER_NODE, 
                {
                    id: id,
                    width:width,
                    height:height
                }
            );
        }
    }

    /**
     * 
     * @param {Event} event 
     */
    addLayoutEvent(event) {
        this.processTreeFromId(event[0], event[1], event[2]);
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
        switch(data.type) {
            case "transformations":
                requestAnimationFrame(() => {
                    for (const action of event.data.transformations) {
                        const parentId = action.parentId;
                        const transformations = action.transformations;
                        const container = this.containers[parentId];
                        container.setSize(transformations);
                    }
                });
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
    }

    /**
     * Say hello! 
     */
    sayHello() {
        console.log("hello");
    }
}