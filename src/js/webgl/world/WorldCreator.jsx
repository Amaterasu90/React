import WorldObjectManager from "../world/WorldObjectManager.jsx";
import WorldObjectReciever from "../world/WorldObjectReciever.jsx";
import SceneReciever from "../scene/SceneReciever.jsx";
import SceneCreator from "../scene/SceneCreator.jsx";

class WorldCreator {
    constructor(worldManager) {
        this.worldObjectManager = new WorldObjectManager(worldManager);
        this.worldObjectReciever = new WorldObjectReciever(worldManager);
        this.sceneReciever = new SceneReciever(this.worldObjectReciever);
        this.sceneInitializer = new SceneCreator(this.worldObjectManager, this.sceneReciever);
    }

    createDefault(embederCallback) {
        this.sceneInitializer.create("mainScene");
        embederCallback();
    }
}

export default WorldCreator;