class MeshReciever {
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
        var result = this.worldObjectReciever.recieve(name, "mesh");
        if (result) {
            return result.object;
        }
    }

    recieveAll(){
        return this.worldObjectReciever.recieveAll().filter(o => o.type === "mesh").map(m => m.object);
    }
}

export default MeshReciever;