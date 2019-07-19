import React, { Component } from 'react';
import * as THREE from 'three';
import RangeComponent from './rangeComponent/RangeComponent.jsx';
import WorldManager from './../webgl/WorldManager.jsx';
import RendererReciever from './../webgl/render/RendererReciever.jsx';
import WorldObjectReciever from '../webgl/world/WorldObjectReciever.jsx';
import SceneReciever from '../webgl/scene/SceneReciever.jsx';
import CameraReciever from '../webgl/camera/CameraReciever.jsx';
import PerspectiveCameraCreator from '../webgl/camera/PerspectiveCameraCreator.jsx';
import WorldObjectManager from '../webgl/world/WorldObjectManager.jsx';
import LightReciever from '../webgl/light/LightReciever.jsx';
import DirectionalLightCreator from '../webgl/light/DirectionalLightCreator.jsx';
import MeshReciever from '../webgl/mesh/MeshReciever.jsx';
import MeshCreator from '../webgl/mesh/MeshCreator.jsx';
import WorldCreator from '../webgl/world/WorldCreator.jsx';
import ThreejsPlugin from '../webgl/ThreejsPlugin.jsx';
import SceneManager from '../webgl/scene/SceneManager.jsx';
import RendererInitializer from '../webgl/render/RendererInitializer.jsx';
import RendererBuilder from '../webgl/render/RendererBuilder.jsx';
import SceneBuilder from '../webgl/scene/SceneBuilder.jsx';
import MeshIntersector from '../webgl/raycast/MeshIntersector.jsx';

class ThreeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            WebGL: {
                renderer: null,
                scene: null,
                camera: null
            }
        }

        this.worldManager = new WorldManager();
        this.worldObjectReciever = new WorldObjectReciever(this.worldManager);
        this.rendererReciever = new RendererReciever(this.worldObjectReciever);
        this.sceneReciever = new SceneReciever(this.worldObjectReciever);
        this.cameraReciever = new CameraReciever(this.worldObjectReciever);
        this.worldObjectManager = new WorldObjectManager(this.worldManager);
        this.cameraCreator = new PerspectiveCameraCreator(this.worldObjectManager, this.cameraReciever);
        this.lightReciever = new LightReciever(this.worldObjectReciever);
        this.directionalLightCreator = new DirectionalLightCreator(this.worldObjectManager, this.lightReciever);
        this.meshReciever = new MeshReciever(this.worldObjectReciever);
        this.meshCreator = new MeshCreator(this.worldObjectManager, this.meshReciever);
        this.rendererInitializer = new RendererInitializer(this.worldObjectManager, this.rendererReciever);
        this.worldCreator = new WorldCreator(this.worldManager);
        this.plugin = new ThreejsPlugin(this.rendererReciever);
        this.sceneManager = new SceneManager(this.sceneReciever);
        this.WebGL = {
            objects: []
        };

        this.speed = 0;
    }

    addCustomSceneObjects() {

    };

    componentDidMount() {
        this.worldCreator.createDefault();
        this.plugin.embed(this.mount, this.props.width, this.props.heigth);

        new SceneBuilder(this.sceneManager, this.meshReciever, this.meshCreator, this.lightReciever, this.directionalLightCreator, this.cameraReciever)
            .addMesh("cube1", new THREE.BoxGeometry(2, 2, 2), new THREE.MeshLambertMaterial({ color: 0x00ff00 }))
            .placeMesh("cube1", { x: 3 })
            .addMesh("cube2", new THREE.BoxGeometry(2, 2, 2), new THREE.MeshLambertMaterial({ color: 0x0000ff }))
            .placeMesh("cube2", { x: -3 })
            .addMesh("cube3", new THREE.BoxGeometry(20, 20, 20), new THREE.MeshLambertMaterial({ color: 0x00ffff, side: THREE.DoubleSide }))
            .addDirectionalLight("directionalLight1", 0xFFFFFF, 1)
            .placeLight("directionalLight1", { x: 100, y: 350, z: 250 })
            .lightCastShadows("directionalLight1", true)
            .placeCamera("camera1", { z: 10 })
            .addObjectToScene(() => this.lightReciever.recieve("directionalLight1"))
            .addObjectToScene(() => this.meshReciever.recieve("cube1"))
            .addObjectToScene(() => this.meshReciever.recieve("cube2"))
            .addObjectToScene(() => this.meshReciever.recieve("cube3"))
            .build();

        this.setState({
            WebGL: this.WebGL
        });

        new RendererBuilder(this.rendererReciever).setAnimationLoop(() => {
            this.update();
            this.rendererReciever.recieve().render(this.sceneReciever.recieve(), this.cameraReciever.recieve("camera1"));
        }).build();
    }

    componentWillUnmount() {
    }

    onDocMouseDown(event) {
        var camera = this.cameraReciever.recieve("camera1");
        var meshesToIntersect = this.meshReciever.recieveAll();
        var intersector = new MeshIntersector({ x: event.clientX, y: event.clientY }, { width: this.props.width, heigth: this.props.heigth });
        intersector.sample(camera, meshesToIntersect, (intersected) => { intersected[0].object.material.color.setHex(Math.random() * 0xffffff) });
    }

    buttonClick(event) {
        this.meshReciever.recieve("cube1").material.color.setHex(Math.random() * 0xff00ff);
        this.speed += 0.01;
    }

    update() {
        this.meshReciever.recieveAll().forEach(e => {
            e.rotation.x += this.speed;
            e.rotation.y += 0.01;
        });
    }

    handleChange(event) {
        this.speed = parseFloat(event.target.value);
    }

    render() {
        return (
            <div style={{ display: 'inline-block' }}>
                <div onClick={event => this.onDocMouseDown(event)}
                    ref={ref => (this.mount = ref)} />
                <button onClick={event => this.buttonClick(event)}>Click me</button>
                <RangeComponent handleChange={event => this.handleChange(event)} min={-0.01} max={0.01} step={0.0001} startValue={0} />
            </div>
        )
    }
}

export default ThreeComponent;