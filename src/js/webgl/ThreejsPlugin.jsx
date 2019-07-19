class ThreejsPlugin {
    constructor(rendererReciever){
        this.rendererReciever = rendererReciever;
    }

    embed(mount, width, heigth) {
        var renderer = this.rendererReciever.recieve();
        renderer.setSize(width, heigth);
        mount.appendChild(renderer.domElement);
    }
}

export default ThreejsPlugin;