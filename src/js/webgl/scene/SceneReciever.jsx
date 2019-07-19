class SceneReciever {
    constructor(worldObjectReciever) {
        this.worldObjectReciever = worldObjectReciever;
    }

    recieve() {
        var result = this.worldObjectReciever.recieveByType("scene")[0];
        if (result) {
            return result.object;
        }
    }
}

export default SceneReciever;