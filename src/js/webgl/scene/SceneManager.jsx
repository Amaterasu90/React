class SceneManager {
    constructor(sceneReciever) {
        this.sceneReciever = sceneReciever;
    }

    addObject(findCallback) {
        var scene = this.sceneReciever.recieve();
        var element3d = findCallback();
        if (scene && element3d) {
            scene.add(element3d);
        }
    }
}

export default SceneManager;