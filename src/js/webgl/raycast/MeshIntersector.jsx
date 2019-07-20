import * as THREE from 'three';

class MeshIntersector {
    constructor(cameraReciever) {
        this.cameraReciever = cameraReciever;
        this.raycaster = new THREE.Raycaster();
    }

    handle(position, meshesToIntersect, intersectsCallback) {
        this.raycaster.setFromCamera(position, this.cameraReciever.recieveFirst());
        const intersectedObjects = this.raycaster.intersectObjects(meshesToIntersect);
        if (intersectedObjects.length) {
            intersectsCallback(intersectedObjects);
        }
    }
}

export default MeshIntersector;