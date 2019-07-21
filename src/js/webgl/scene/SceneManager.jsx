class SceneManager {
    constructor(sceneReciever) {
        this.sceneReciever = sceneReciever;
    }

    addObject(findCallback, name) {
        name = name || "mainScene";
        var scene = this.sceneReciever.recieve(name);
        var element3d = findCallback();
        if (scene && element3d) {
            scene.add(element3d);
        }
    }
}

export default SceneManager;