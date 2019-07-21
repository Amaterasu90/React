class ElementCreator {
    constructor(rootElement) {
        this.rootElement = rootElement;
    }

    create(newChild){
        return this.rootElement.createElement(newChild);
    }
}

export default ElementCreator;