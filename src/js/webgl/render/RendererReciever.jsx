class RendererReciever {
    constructor(worldObjectReciever) {
        this.worldObjectReciever = worldObjectReciever;
    }

    recieve() {
        var result = this.worldObjectReciever.recieveByType("renderer")[0];
        if (result) {
            return result.object;
        }
    }
}

export default RendererReciever;