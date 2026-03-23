/**
 * Layout Event Controller used to subscribe to events
 * and publish events.
 */
class LayoutEventController {

    constructor() {
        this.subscribers = new Map();
    }

    /**
     * Subscribe to event type and provide handler
     * @param {String} type 
     * @param {Function} handler 
     * @returns 
     */
    subscribe(type, handler) {
        // Create set for type if it doesn't exist
        if (!this.subscribers.has(type)) {
            this.subscribers.set(type, new Set());
        }

        // Add handler to type set
        const handlers = this.subscribers.get(type);
        handlers.add(handler);

        // Return unsubscribe function 
        const unsubscribe = () => {
            handlers.delete(handler);
            if (handlers.size === 0) {
                this.subscribers.delete(type);
            }
        }

        return unsubscribe;
    }

    /**
     * Publishes the event to the subscribers.
     * @param {Object} event 
     * @returns 
     */
    publish(event) {
        const handlers = this.subscribers.get(event.type);
        if (!handlers) return;

        for (const handler of handlers) {
            handler(event);
        }
    }

}

export default LayoutEventController;

