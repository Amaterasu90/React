class WorldManager {
    constructor() {
        this.ObjectRegister = [];
        this.Renderer = null;
    }

    initialize() {
    }

    getRenderer() {
        return this.Renderer;
    }

    setRenderer(renderer) {
        if (!this.Renderer && renderer) {
            this.Renderer = renderer;
        }
    }

    getAllObjects() {
        return this.ObjectRegister;
    }

    removeObject(object) {
        return this.ObjectRegister = this.ObjectRegister.filter(o => o.name === object);
    }
}

export default WorldManager;