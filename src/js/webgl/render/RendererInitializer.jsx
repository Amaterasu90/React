import * as THREE from 'three';

class RendererInitializer {
    constructor(worldObjectManager, renderReciever) {
        this.worldObjectManager = worldObjectManager;
        this.renderReciever = renderReciever;
    }

    initialize(htmlElementToHooked) {
        var renderer = this.renderReciever.recieve();
        if (!renderer) {
            this.worldObjectManager.setRenderer(new THREE.WebGLRenderer({canvas: htmlElementToHooked}));
        }
    }
}

export default RendererInitializer;