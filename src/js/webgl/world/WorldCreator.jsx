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
        this.cameraReciever = new CameraReciever(this.worldObjectReciever);
        this.cameraCreator = new PerspectiveCameraCreator(this.worldObjectManager, this.cameraReciever);
        this.renderReciever = new RendererReciever(this.worldObjectReciever);
        this.rendererInitializer = new RendererInitializer(this.worldObjectManager, this.renderReciever);
        this.sceneReciever = new SceneReciever(this.worldObjectReciever);
        this.sceneInitializer = new SceneInitializer(this.worldObjectManager, this.sceneReciever);
    }

    createDefault() {
        this.sceneInitializer.initialize();
        this.cameraCreator.create("camera1");
        this.rendererInitializer.initialize();
        var renderer = this.renderReciever.recieve();
        renderer.setClearColor(0xffffff);
    }
}

export default WorldCreator;