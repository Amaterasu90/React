class ElementEmbedder {
    constructor(domParentElement) {
        this.domParentElement = domParentElement;
    }

    embed(childHtmlElement) {
        this.domParentElement.appendChild(childHtmlElement);
    }
}

export default ElementEmbedder;