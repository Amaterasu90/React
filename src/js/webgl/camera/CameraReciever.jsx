class CameraReciever {
    constructor(worldObjectReciever) {
        this.worldObjectReciever = worldObjectReciever;
    }

    recieveByName(name){
        var result = this.worldObjectReciever.recieveByName(name);
        if (result) {
            return result.object;
        }
    }

    recieve(name) {
        var result = this.worldObjectReciever.recieve(name, "camera");
        if (result) {
            return result.object;
        }
    }
}

export default CameraReciever;