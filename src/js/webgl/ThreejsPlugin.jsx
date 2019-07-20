class ThreejsWindowPlugin {
    constructor(rendererInitializer, rendererReciever){
        this.rendererInitializer = rendererInitializer;
        this.rendererReciever = rendererReciever;
    }

    embed(htmlElementToHooked, width, heigth) {
        this.rendererInitializer.initialize(htmlElementToHooked);
        var renderer = this.rendererReciever.recieve();
        renderer.setSize(width, heigth);
    }
}

export default ThreejsWindowPlugin;