class ElementReciever {
    constructor(rootElement) {
        this.rootElement = rootElement
    }

    recieveBySelector(selector) {
        return this.rootElement.querySelector(selector);
    }
}

export default ElementReciever;