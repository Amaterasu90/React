import * as THREE from 'three';

class MeshPointerIntersector {

    constructor(pointerLocation, displayDimensions){
        this.pointerLocation = pointerLocation;
        this.displayDimensions = displayDimensions;
        this.raycaster = new THREE.Raycaster();
    }

    sample(camera, meshesToIntersect, intersectsCallback) {
        const mouse3D = new THREE.Vector2(
            (this.pointerLocation.x / this.displayDimensions.width) * 2 - 1,
            -(this.pointerLocation.y / this.displayDimensions.height) * 2 + 1
        );
        this.raycaster.setFromCamera(mouse3D, camera);
        let intersectedObjects = this.raycaster.intersectObjects(meshesToIntersect);

        if (intersectedObjects.length > 0) {
            intersectsCallback(intersectedObjects);
        }
    }
}

export default MeshPointerIntersector;