class SceneReciever {
    constructor(worldObjectReciever) {
        this.worldObjectReciever = worldObjectReciever;
    }

    recieve(name) {
        var result = this.worldObjectReciever.recieve(name, "scene");
        if (result) {
            return result.object;
        }
    }

    recieveFirst(){
        var result = this.worldObjectReciever.recieveByType("scene")[0];
        if (result) {
            return result.object;
        }
    }
}

export default SceneReciever;