export class Size {

    /**
     * Initializes the size object with the given width and height.
     * @param {Number} width 
     * @param {Number} height 
     */
    constructor (width, height) {
        this.width = width;
        this.height = height;
    }

    /**
     * 
     * @returns {Number} Width of the size.
     */
    getWidth() {
        return this.width;
    }

    /**
     * 
     * @returns {Number} Height of the size.
     */
    getHeight() {
        return this.height;
    }

}