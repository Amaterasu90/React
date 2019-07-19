import * as THREE from 'three';

class DirectionalLightCreator {
    constructor(worldObjectManager, lightReciever) {
        this.worldObjectManager = worldObjectManager;
        this.lightReciever = lightReciever;
    }

    create(name, color = 0xFFFFFF, intesity = 1) {
        var lights = this.lightReciever.recieveByName(name);
        if (!lights || lights.length === 0) {
            this.worldObjectManager.addObject({ name: name, object: new THREE.DirectionalLight(color, intesity), type: "light" });
        }
    }
}

export default DirectionalLightCreator;