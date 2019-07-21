class MeshReciever {
    constructor(worldObjectReciever) {
        this.worldObjectReciever = worldObjectReciever;
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