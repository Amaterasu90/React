class RendererBuilder {
    constructor(rendererReciever) {
        this.renderer = rendererReciever.recieve();

        this.operationParts = [];
    }

    setAnimationLoop(callback) {
        this.operationParts.push(() => { this.renderer.setAnimationLoop(callback) });
        return this;
    }

    build() {
        this.operationParts.forEach((operation) => {
            operation();
        })
    }
}

export default RendererBuilder;