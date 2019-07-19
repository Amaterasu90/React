import RendererInitializer from './render/RendererInitializer.jsx';
import WorldObjectManager from './world/WorldObjectManager.jsx';
import WorldObjectReciever from './world/WorldObjectReciever.jsx';
import RendererReciever from './render/RendererReciever.jsx';
import SceneReciever from './scene/SceneReciever.jsx';
import SceneInitializer from './scene/SceneInitializer.jsx';

class WorldManager {
    constructor(){
        this.ObjectRegister = [];
    }

    initialize(){
        var worldObjectManager = new WorldObjectManager(this);
        var worldObjectReciever = new WorldObjectReciever(this);
        var sceneReciever = new SceneReciever(worldObjectReciever);
        var sceneInitializer = new SceneInitializer(worldObjectManager, sceneReciever);
        sceneInitializer.initialize();
    }

    getAllObjects(){
        return this.ObjectRegister;
    }

    removeObject(object){
        return this.ObjectRegister = this.ObjectRegister.filter(o => o.name === object);
    }
}

export default WorldManager;