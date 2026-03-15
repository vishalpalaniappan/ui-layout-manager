/**
 * This class handles all layout caching functionality. It enables the program to 
 * save the layout to local storage and load it from local storage.
 */

export class LayoutCacher {

    /**
     * 
     * @param {Object} layout 
     */
    constructor (layout) {

    }

    /**
     * Saves the layout state to local storage.
     * @param {Object} sizes Sizes of the containers.
     */
    saveToCache (sizes) {
        localStorage.setItem("sizes", JSON.stringify(sizes));
    }

    /**
     * Gets the layout state from local storage.
     */
    getFromCache() {
        return JSON.parse(localStorage.getItem("sizes"));
    }
}