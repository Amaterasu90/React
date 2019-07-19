import * as THREE from 'three';

class PerspectiveCameraCreator {
    constructor(worldObjectManager, cameraReciever) {
        this.worldObjectManager = worldObjectManager;
        this.cameraReciever = cameraReciever;
    }

    create(name, fov = 75, aspect = 1, near = 0.1, far = 100) {
        var cameras = this.cameraReciever.recieveByName(name);
        if (!cameras || cameras.length === 0) {
            this.worldObjectManager.addObject({ name: name, object: new THREE.PerspectiveCamera(fov, aspect, near, far), type: "camera" });
        }
    }
}

export default PerspectiveCameraCreator;