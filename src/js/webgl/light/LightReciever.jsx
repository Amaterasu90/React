class LightReciever {
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
        var result = this.worldObjectReciever.recieve(name, "light");
        if (result) {
            return result.object;
        }
    }
}

export default LightReciever;