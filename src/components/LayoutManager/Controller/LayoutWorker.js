/**
 * This function receives messages from the main thread and executes
 * the layout manipulation logic.
 * @param {Object} e 
 */
self.onmessage = function (e) {

    //TODO: Implement layout management logic in worker.
    
    if (e.data == "hello") {
        self.postMessage("hello from worker!")
    }
}