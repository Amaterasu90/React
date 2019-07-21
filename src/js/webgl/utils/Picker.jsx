import * as THREE from 'three';

class Picker {
    constructor(rendererReciever) {
        this.rendererReciever = rendererReciever;
        this.pickingTexture = new THREE.WebGLRenderTarget(1, 1);
        this.pixelBuffer = new Uint8Array(4);
        this.pickedObject = null;
        this.pickedObjectSavedColor = 0;
    }
    pick(cssPosition, scene, camera) {
        const { pickingTexture, pixelBuffer } = this;

        const renderer = this.rendererReciever.recieve()
        const pixelRatio = renderer.getPixelRatio();
        camera.setViewOffset(
            renderer.context.drawingBufferWidth,
            renderer.context.drawingBufferHeight,
            cssPosition.x * pixelRatio | 0,
            cssPosition.y * pixelRatio | 0,
            1,
            1,
        );

        renderer.setRenderTarget(pickingTexture);
        renderer.render(scene, camera);
        renderer.setRenderTarget(null);
        camera.clearViewOffset();
        renderer.readRenderTargetPixels(
            pickingTexture,
            0,
            0,
            1,
            1,
            pixelBuffer);

        const id =
            (pixelBuffer[0] << 16) |
            (pixelBuffer[1] << 8) |
            (pixelBuffer[2] << 0);

        return id;
    }
}

export default Picker;