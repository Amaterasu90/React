class WorldObjectReciever {
    constructor(worldManager){
        this.worldManager = worldManager;
    }

    recieveAll(){
        return this.worldManager.getAllObjects();
    }

    recieveByType(type){
        var objects = this.worldManager.getAllObjects();
        if (objects) {
            return objects.filter(o => o.type === type);
        }
    }

    recieveByName(name){
        var objects = this.worldManager.getAllObjects();
        if (objects) {
            var searchedObjects = objects.filter(o => o.name === name);
            if(searchedObjects.length === 1){
                return searchedObjects[0];
            }
        }
    }

    recieve(name, type){
        var objects = this.worldManager.getAllObjects();
        if (objects) {
            var searchedObjects = objects.filter(o => o.name === name && o.type === type);
            if(searchedObjects.length === 1){
                return searchedObjects[0];
            }
        }
    }
}

export default WorldObjectReciever;