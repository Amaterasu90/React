class SceneBuilder {
    constructor(sceneManager, meshReciever, meshCreator, lightReciever, directionalLightCreator, cameraRetriever) {
        this.sceneManager = sceneManager;
        this.meshReciever = meshReciever;
        this.meshCreator = meshCreator;
        this.lightReciever = lightReciever;
        this.directionalLightCreator = directionalLightCreator;
        this.cameraRetriever = cameraRetriever;
        this.opeations = [];
    }

    addMesh(name, geometry, material) {
        this.opeations.push(() => {
            this.meshCreator.create(name, geometry, material);
        });

        return this;
    }

    placeMesh(name, position) {
        this.opeations.push(() => {
            var mesh = this.meshReciever.recieve(name);
            mesh.position.x = position.x || 0;
            mesh.position.y = position.y || 0;
            mesh.position.z = position.z || 0;
        });

        return this;
    }

    addDirectionalLight(name, color, intesity) {
        this.opeations.push(() => {
            this.directionalLightCreator.create(name, color, intesity);
        });

        return this;
    }

    placeLight(name, position) {
        this.opeations.push(() => {
            var directionalLight = this.lightReciever.recieve(name);
            directionalLight.position.set(position.x || 0, position.y || 0, position.z || 0);
        });

        return this;
    }

    lightCastShadows(name, castShadow) {
        this.opeations.push(() => {
            var directionalLight = this.lightReciever.recieve(name);
            directionalLight.castShadow = castShadow;
        });

        return this;
    }

    placeCamera(name, position) {
        this.opeations.push(() => {
            var camera = this.cameraRetriever.recieve(name);
            camera.position.x = position.x || 0;
            camera.position.y = position.y || 0;
            camera.position.z = position.z || 0;
        });

        return this;
    }

    addObjectToScene(findCallback) {
        this.opeations.push(() => {
            this.sceneManager.addObject(findCallback);
        });

        return this;
    }

    build() {
        this.opeations.forEach((operation) => {
            operation();
        })
    }
}

export default SceneBuilder;