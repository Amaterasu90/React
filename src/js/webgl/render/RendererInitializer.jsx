import * as THREE from 'three';

class RendererInitializer {
    constructor(worldObjectManager, renderReciever) {
        this.worldObjectManager = worldObjectManager;
        this.renderReciever = renderReciever;
    }

    initialize() {
        var renderer = this.renderReciever.recieve();
        if (!renderer) {
            this.worldObjectManager.addObject({ name: "mainRenderer", object: new THREE.WebGLRenderer(), type: "renderer" });
        }
    }
}

export default RendererInitializer;