import * as THREE from 'three';

class SceneCreator {
    constructor(worldObjectManager, sceneReciever) {
        this.worldObjectManager = worldObjectManager;
        this.sceneReciever = sceneReciever;
    }

    create(name) {
        var scenes = this.sceneReciever.recieve(name);
        if (!scenes || scenes.length === 0) {
            this.worldObjectManager.addObject({ name: name, object: new THREE.Scene(), type: "scene" });
        }
    }
}

export default SceneCreator;