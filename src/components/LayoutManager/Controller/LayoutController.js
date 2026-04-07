import LAYOUT_WORKER_PROTOCOL from "./LAYOUT_WORKER_PROTOCOL";
import TRANSFORMATION_TYPES from "./TRANSFORMATION_TYPES";

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
        this.worker = null;        
    }

    /**
     * Start the worker.
     */
    startWorker() {
        try {
            this.worker = new Worker(
                new URL('./Worker/LayoutWorker.js', import.meta.url),
                { type: 'module' }
            );
            this.worker.onmessage = this.handleWorkerMessage.bind(this);
            this.worker.onerror = (error) => console.error('Worker error:', error);
            this.sendToWorker(LAYOUT_WORKER_PROTOCOL.INITIALIZE, {ldf: this.ldf})
            
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
        if (!this.worker) {
            this.startWorker();
        }
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
     */
    handleRootResize() { 
        if (!this.layoutLoaded) return;
        // console.log("Root container resized to:", width, height);
        const sizes = {};
        for (const id in this.containerRefs) {
            if (this.containerRefs.hasOwnProperty(id)) {
                const boundingRect = this.containerRefs[id].getBoundingClientRect();
                sizes[id] = {
                    width: boundingRect.width, 
                    height: boundingRect.height
                };
            }
        }        
        this.sendToWorker(
            LAYOUT_WORKER_PROTOCOL.APPLY_SIZES, 
            { sizes: sizes }
        );    
    }


    /**
     * Move handle bar is called by the handle bar component with the
     * metadata about its parent and the siblings being resized. This
     * information is parsed and passed to the layout editor to enforce
     * the layout rules.
     * @param {Object} metadata 
     */
    moveHandleBar(metadata) {
        let sizes = {};
        const containerIds = [metadata.parent, metadata.sibling1, metadata.sibling2];
        for (const containerId of containerIds) {
            let boundingRect = this.containerRefs[containerId].getBoundingClientRect();
            sizes[containerId] = {
                width: boundingRect.width, 
                height: boundingRect.height
            };
        }

        metadata.sizes = sizes;  
        this.sendToWorker(
            LAYOUT_WORKER_PROTOCOL.MOVE_HANDLE_BAR, 
            { 
                metadata: metadata
            }
        );

        // TODO: This is temporary, after handle bar move, the layout rules are
        // applied to react to new container sizes. This can be done more efficiently
        // because we only need to react the containers that were changed. This calculates
        // the entire layout.
        this.handleRootResize();
    }

    /**
     * Apply the given transformations
     * @param {Object} transformations 
     * @param {Object} isInitial 
     */
    applyTransformations (transformations, isInitial) {
        requestAnimationFrame(() => {
            for (const transformation of transformations) {
                switch (transformation.type) {
                    case TRANSFORMATION_TYPES.UPDATE_SIZE:
                        this.containers[transformation.id].current.updateStyles(
                            transformation.args.style
                        );
                        break;
                    case TRANSFORMATION_TYPES.REMOVE_NODE:
                        break;
                    default:
                        console.warn("Unknown transformation was requested.");
                        break;
                }
            };
            if (isInitial) {
                this.layoutLoaded = true;
            }
        });
    };

    /**
     * Handles messages from worker
     * @param {Object} event 
     */
    handleWorkerMessage(event) {
        let transformations;
        switch(event.data.type) {
            case LAYOUT_WORKER_PROTOCOL.INITIALIZE_FLEXBOX:
                transformations = event.data.data;
                this.applyTransformations(transformations, true);
                // TODO: Only make containers visible after the layout
                // is applied to avoid glitchy rendering.
                break;
            case LAYOUT_WORKER_PROTOCOL.TRANSFORMATIONS:
                transformations = event.data.data;
                this.applyTransformations(transformations, false);
                break;
            case LAYOUT_WORKER_PROTOCOL.ERROR:
                console.error("Error from worker:", event.data);
                break;
            default:
                break;
        }
    }

    /**
     * Invoke a specific action on a container given the id.
     */
    invokeAction({id, action, args}) {
        this.sendToWorker(
            LAYOUT_WORKER_PROTOCOL.INVOKE_ACTION, 
            { 
                id: id,
                action: action,
                args: args
            }
        );
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