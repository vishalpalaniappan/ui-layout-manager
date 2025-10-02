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

        this.numberOfContainers = this.ldf.containers ? Object.keys(this.ldf.containers).length: 0;

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
            this.sendToWorker(LAYOUT_WORKER_PROTOCOL.INITIALIZE_FLEXBOX);
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
        if (!this.layoutLoaded) return;
        console.log("Root container resized to:", width, height);
        const sizes = {};
        for (const id in this.containerRefs) {
            if (this.containerRefs.hasOwnProperty(id)) {
                const boundingRect = this.containerRefs[id].getBoundingClientRect();
                sizes[id] = {width: boundingRect.width, height: boundingRect.height};
            }
        }        
        this.sendToWorker(
            LAYOUT_WORKER_PROTOCOL.APPLY_SIZES, 
            { sizes: sizes }
        );    
    }

    /**
     * Handles messages from worker
     * @param {Object} event 
     */
    handleWorkerMessage(event) {
        switch(event.data.type) {
            case LAYOUT_WORKER_PROTOCOL.INITIALIZE_FLEXBOX:
                console.log("Applying transformations:");
                this.transformations = event.data.data;
                requestAnimationFrame(() => {
                    for (const transformation of this.transformations) {
                        console.log(transformation);
                        this.containers[transformation.id].current.updateSize(transformation.size);
                    };
                    this.layoutLoaded = true;
                });
            case LAYOUT_WORKER_PROTOCOL.TRANSFORMATIONS:
                console.log("Applying transformations:");
                this.transformations = event.data.data;
                requestAnimationFrame(() => {
                    for (const transformation of this.transformations) {
                        console.log(transformation);
                        this.containers[transformation.id].current.updateSize(transformation.size);
                    };
                });
                break;
            case LAYOUT_WORKER_PROTOCOL.ERROR:
                console.error("Error from worker:", event.data);
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
}