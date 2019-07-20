class RendererReciever {
    constructor(worldObjectReciever) {
        this.worldObjectReciever = worldObjectReciever;
    }

    recieve() {
        return this.worldObjectReciever.getRenderer();
    }
}

export default RendererReciever;