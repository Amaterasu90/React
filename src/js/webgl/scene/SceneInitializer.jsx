import * as THREE from 'three';

class SceneInitializer {
    constructor(worldObjectManager, sceneReciever) {
        this.worldObjectManager = worldObjectManager;
        this.sceneReciever = sceneReciever;
    }

    initialize() {
        var scene = this.sceneReciever.recieve();
        if (!scene) {
            this.worldObjectManager.addObject({ name: "mainScene", object: new THREE.Scene(), type: "scene" });
        }
    }
}

export default SceneInitializer;