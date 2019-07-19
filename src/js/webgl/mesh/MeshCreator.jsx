import * as THREE from 'three';

class MeshCreator {
    constructor(worldObjectManager, meshReciever) {
        this.worldObjectManager = worldObjectManager;
        this.meshReciever = meshReciever;
    }

    create(name, geometry = new THREE.BoxGeometry(2, 2, 2), material = new THREE.MeshLambertMaterial({ color: 0x00ff00 })) {
        var meshes = this.meshReciever.recieveByName(name);
        if (!meshes || meshes.length === 0) {
            this.worldObjectManager.addObject({ name: name, object: new THREE.Mesh(geometry, material), type: "mesh" });
        }
    }
}

export default MeshCreator;