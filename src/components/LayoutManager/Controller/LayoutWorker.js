self.onmessage = function (e) {

    if (e.data == "hello") {
        self.postMessage("hello from worker!")
    }
}