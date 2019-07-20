import React, { Component } from 'react';
import * as THREE from 'three';
import OrbitContols from 'three-orbitcontrols';
import WorldManager from '../../webgl/WorldManager.jsx';
import RendererReciever from '../../webgl/render/RendererReciever.jsx';
import WorldObjectReciever from '../../webgl/world/WorldObjectReciever.jsx';
import SceneReciever from '../../webgl/scene/SceneReciever.jsx';
import CameraReciever from '../../webgl/camera/CameraReciever.jsx';
import PerspectiveCameraCreator from '../../webgl/camera/PerspectiveCameraCreator.jsx';
import WorldObjectManager from '../../webgl/world/WorldObjectManager.jsx';
import LightReciever from '../../webgl/light/LightReciever.jsx';
import DirectionalLightCreator from '../../webgl/light/DirectionalLightCreator.jsx';
import MeshReciever from '../../webgl/mesh/MeshReciever.jsx';
import MeshCreator from '../../webgl/mesh/MeshCreator.jsx';
import WorldCreator from '../../webgl/world/WorldCreator.jsx';
import ThreejsWindowPlugin from '../../webgl/ThreejsPlugin.jsx';
import SceneManager from '../../webgl/scene/SceneManager.jsx';
import RendererInitializer from '../../webgl/render/RendererInitializer.jsx';
import RendererBuilder from '../../webgl/render/RendererBuilder.jsx';
import SceneBuilder from '../../webgl/scene/SceneBuilder.jsx';
import MeshPointerIntersector from '../../webgl/raycast/MeshPointerIntersector.jsx';
import LabeledMeshCreator from '../../webgl/mesh/LabeledMeshCreator.jsx';
import MeshIntersector from '../../webgl/raycast/MeshIntersector.jsx';

import './style.css';

class BoxesComponent extends Component {
    constructor(props) {
        super(props);
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
        this.plugin = new ThreejsWindowPlugin(this.rendererInitializer, this.rendererReciever);
        this.sceneManager = new SceneManager(this.sceneReciever);
        this.labeledMeshCreator = new LabeledMeshCreator(this.worldObjectManager, this.meshReciever);
        this.speed = 0;
        this.tempV = new THREE.Vector3();
        this.meshIntersector = new MeshIntersector(this.cameraReciever);
    }

    componentDidMount() {
        this.canvas = document.querySelector("#BoxesWindow");
        this.worldCreator.createDefault(() => {
            this.plugin.embed(this.canvas, parseInt(this.props.width), parseInt(this.props.height));
        });

        const labelContainerElem = document.querySelector('#labels');
        new SceneBuilder(
                this.sceneManager,
                this.meshReciever,
                this.meshCreator,
                this.cameraCreator,
                this.lightReciever,
                this.directionalLightCreator,
                this.cameraReciever,
                this.labeledMeshCreator)
            .addPerspectiveCamera("camera", 75, 2, 0.1, 5)
            .placeCamera("camera", { z: 2 })
            .addMeshWithLabel("Aqua Colored Box", new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial({ color: 0x44aa88 }), labelContainerElem)
            .addMeshWithLabel("Purple Colored Box", new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial({ color: 0x8844aa }), labelContainerElem)
            .placeMesh("Purple Colored Box", { x: 2 })
            .addMeshWithLabel("Gold Colored Box", new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial({ color: 0xaa8844 }), labelContainerElem)
            .placeMesh("Gold Colored Box", { x: -2 })
            .addDirectionalLight("light", 0xffffff, 1)
            .placeLight("light", { x: -1, y: 2, z: 4 })
            .build();

        const controls = new OrbitContols(this.cameraReciever.recieveFirst(), this.canvas);
        controls.target.set(0, 0, 0);
        controls.update();

        new RendererBuilder(this.rendererReciever).setAnimationLoop((time) => {
            this.update(time);
            this.rendererReciever.recieve().render(this.sceneReciever.recieve(), this.cameraReciever.recieveFirst());
        }).build();
    }

    componentWillUnmount() {
    }

    onDocMouseDown(event) {
        var camera = this.cameraReciever.recieveFirst();
        var meshesToIntersect = this.meshReciever.recieveAll();
        var intersector = new MeshPointerIntersector({ x: event.clientX, y: event.clientY }, { width: this.props.width, height: this.props.height });
        intersector.sample(camera, meshesToIntersect, (intersected) => { intersected[0].object.material.color.setHex(Math.random() * 0xffffff) });
    }

    update(time) {
        time *= 0.001;
        var meshes = this.worldObjectReciever.recieveByType("mesh");
        meshes.forEach((cubeInfo, ndx) => {
            const { object, htmlElem } = cubeInfo;
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            object.rotation.x = rot;
            object.rotation.y = rot;

            object.updateWorldMatrix(true, false);
            object.getWorldPosition(this.tempV);

            this.tempV.project(this.cameraReciever.recieveFirst());

            this.meshIntersector.handle(this.tempV, meshes.map(o => o.object), (intersected) => {
                if (intersected[0].object !== object || Math.abs(this.tempV.z) > 1) {
                    htmlElem.style.display = 'none';
                }
                else {
                    htmlElem.style.display = '';

                    const x = (this.tempV.x * .5 + .5) * this.props.width;
                    const y = (this.tempV.y * -.5 + .5) * this.props.height;

                    htmlElem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
                    htmlElem.style.zIndex = (-this.tempV.z * .5 + .5) * 100000 | 0;
                }
            });
        });
    }

    render() {
        return (
            <div id="container">
                <canvas id="BoxesWindow" onClick={event => this.onDocMouseDown(event)} />
                <div id="labels" />
            </div>
        )
    }
}

export default BoxesComponent;