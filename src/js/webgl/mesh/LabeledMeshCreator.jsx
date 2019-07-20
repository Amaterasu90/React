import * as THREE from 'three';

class LabeledMeshCreator {
    constructor(worldObjectManager, meshReciever) {
        this.worldObjectManager = worldObjectManager;
        this.meshReciever = meshReciever;
    }

    create(name, geometry = new THREE.BoxGeometry(2, 2, 2), material = new THREE.MeshLambertMaterial({ color: 0x00ff00 }), htmlContainer) {
        var meshes = this.meshReciever.recieveByName(name);
        if (!meshes || meshes.length === 0) {
            const elem = document.createElement('div');
            elem.textContent = name;
            htmlContainer.appendChild(elem);

            this.worldObjectManager.addObject({ name: name, object: new THREE.Mesh(geometry, material), type: "mesh", htmlElem: elem });
        }
    }
}

export default LabeledMeshCreator;