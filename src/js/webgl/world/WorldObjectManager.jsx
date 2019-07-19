class WorldObjectManager {
    constructor(worldManager) {
        this.worldManager = worldManager;
    }

    addObject(object) {
        if (object) {
            var objects = this.worldManager.getAllObjects();
            if(objects){
                this.worldManager.getAllObjects().push(object);
            }
        }
    }

    removeObject(object) {
        if (object) {
            this.worldManager.removeObject(object);
        }
    }
}

export default WorldObjectManager;