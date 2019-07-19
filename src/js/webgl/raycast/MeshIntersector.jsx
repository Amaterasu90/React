import * as THREE from 'three';

class MeshIntersector {

    constructor(pointerLocation, displayDimensions){
        this.pointerLocation = pointerLocation;
        this.displayDimensions = displayDimensions;
    }

    sample(camera, meshesToIntersect, callbackIfIntersects) {
        const mouse3D = new THREE.Vector2(
            (this.pointerLocation.x / this.displayDimensions.width) * 2 - 1,
            -(this.pointerLocation.y / this.displayDimensions.heigth) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse3D, camera);
        let intersects = raycaster.intersectObjects(meshesToIntersect);

        if (intersects.length > 0) {
            callbackIfIntersects(intersects);
        }
    }
}

export default MeshIntersector;