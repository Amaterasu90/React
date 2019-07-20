import WorldObjectManager from "../world/WorldObjectManager.jsx";
import PerspectiveCameraCreator from "../camera/PerspectiveCameraCreator.jsx";
import CameraReciever from "../camera/CameraReciever.jsx";
import WorldObjectReciever from "../world/WorldObjectReciever.jsx";
import RendererReciever from "../render/RendererReciever.jsx";
import RendererInitializer from "../render/RendererInitializer.jsx";
import SceneReciever from "../scene/SceneReciever.jsx";
import SceneInitializer from "../scene/SceneInitializer.jsx";

class WorldCreator {
    constructor(worldManager) {
        this.worldObjectManager = new WorldObjectManager(worldManager);
        this.worldObjectReciever = new WorldObjectReciever(worldManager);
        this.sceneReciever = new SceneReciever(this.worldObjectReciever);
        this.sceneInitializer = new SceneInitializer(this.worldObjectManager, this.sceneReciever);
    }

    createDefault(embederCallback) {
        this.sceneInitializer.initialize();
        embederCallback();
    }
}

export default WorldCreator;