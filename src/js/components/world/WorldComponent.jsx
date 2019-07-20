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
import LabeledMeshCreator from '../../webgl/mesh/LabeledMeshCreator.jsx';
import MeshIntersector from '../../webgl/raycast/MeshIntersector.jsx';

import Image from './country-outlines-4k.png';
import CountriesInfo from './CountriesInfo.jsx';

import './style.css';
import RangeComponent from '../rangeComponent/RangeComponent.jsx';

class WorldComponent extends Component {
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

        this.renderRequested = false;
        this.tempV = new THREE.Vector3();
        this.cameraToPoint = new THREE.Vector3();
        this.cameraPosition = new THREE.Vector3();
        this.normalMatrix = new THREE.Matrix3();

        this.matrix = new THREE.Matrix4()
        this.state = {
            settings: {
                minArea: 10,
                maxVisibleDot: -0.2,
            }
        };
    }

    animationFrame(time) {
        this.update(time);
        this.rendererReciever.recieve().render(this.sceneReciever.recieve(), this.cameraReciever.recieveFirst());
    }

    componentDidMount() {
        this.canvas = document.querySelector("#WorldWindow");
        this.worldCreator.createDefault(() => {
            this.plugin.embed(this.canvas, parseInt(this.props.width), parseInt(this.props.width));
        });

        new RendererBuilder(this.rendererReciever)
            .setClearColor("#236")
            .setAnimationLoop((time) => { this.animationFrame(time) }).build();

        const loader = new THREE.TextureLoader();
        const texture = loader.load(Image);

        new SceneBuilder(
            this.sceneManager,
            this.meshReciever,
            this.meshCreator,
            this.cameraCreator,
            this.lightReciever,
            this.directionalLightCreator,
            this.cameraReciever,
            this.labeledMeshCreator)
            .addMesh("world", new THREE.SphereBufferGeometry(1, 64, 32), new THREE.MeshBasicMaterial({ map: texture }))
            .addPerspectiveCamera("camera", 75, 2, 0.1, 5)
            .placeCamera("camera", { z: 2.5 })
            .build();

        this.controls = new OrbitContols(this.cameraReciever.recieveFirst(), this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 0.1;
        this.controls.enablePan = false;
        this.controls.minDistance = 1.2;
        this.controls.maxDistance = 4;
        this.controls.update();

        const lonFudge = Math.PI * 1.5;
        const latFudge = Math.PI;
        const lonHelper = new THREE.Object3D();
        const latHelper = new THREE.Object3D();
        lonHelper.add(latHelper);
        const positionHelper = new THREE.Object3D();
        positionHelper.position.z = 1;
        latHelper.add(positionHelper);

        this.labelParentElem = document.querySelector('#labels');
        for (const countryInfo of CountriesInfo) {
            const { lat, lon, min, max, name } = countryInfo;

            lonHelper.rotation.y = THREE.Math.degToRad(lon) + lonFudge;
            latHelper.rotation.x = THREE.Math.degToRad(lat) + latFudge;

            positionHelper.updateWorldMatrix(true, false);
            const position = new THREE.Vector3();
            positionHelper.getWorldPosition(position);
            countryInfo.position = position;

            const width = max[0] - min[0];
            const height = max[1] - min[1];
            const area = width * height;
            countryInfo.area = area;

            const elem = document.createElement('div');
            elem.textContent = name;
            this.labelParentElem.appendChild(elem);
            countryInfo.elem = elem;
        }

        this.requestRenderIfNotRequested();

        this.controls.addEventListener('change', () => { this.requestRenderIfNotRequested() });
    }

    requestRenderIfNotRequested() {
        if (!this.renderRequested) {
            this.renderRequested = true;
            this.updateLabels();
        }
    }

    updateLabels(time) {
        if (!CountriesInfo) {
            return;
        }

        const large = this.state.settings.minArea * this.state.settings.minArea;

        var camera = this.cameraReciever.recieveFirst();
        this.normalMatrix.getNormalMatrix(camera.matrixWorldInverse);
        camera.getWorldPosition(this.cameraPosition);

        for (const countryInfo of CountriesInfo) {
            const { position, elem, area } = countryInfo;

            if (area < large) {
                elem.style.display = 'none';
                continue;
            }

            this.tempV.copy(position);
            this.tempV.applyMatrix3(this.normalMatrix);

            this.cameraToPoint.copy(position);
            this.cameraToPoint.applyMatrix4(camera.matrixWorldInverse).normalize();

            const dot = this.tempV.dot(this.cameraToPoint);

            if (dot > this.state.settings.maxVisibleDot) {
                elem.style.display = 'none';
                continue;
            }

            elem.style.display = '';

            this.tempV.copy(position);
            this.tempV.project(camera);

            const x = (this.tempV.x * .5 + .5) * parseInt(this.props.width);
            const y = (this.tempV.y * -.5 + .5) * parseInt(this.props.height);

            elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;

            elem.style.zIndex = (-this.tempV.z * .5 + .5) * 100000 | 0;
        }
    }

    update(time) {
        this.renderRequested = undefined;
        var camera = this.cameraReciever.recieveFirst()
        camera.aspect = parseInt(this.props.width) / parseInt(this.props.height);
        camera.updateWorldMatrix();

        this.controls.update();

        this.updateLabels(time);

        var camera = this.cameraReciever.recieveFirst();
        var angle = 0.001;
        var axis = new THREE.Vector3(0, 1, 0);
        var quaternion = new THREE.Quaternion;
        camera.position.applyQuaternion(quaternion.setFromAxisAngle(axis, angle));
        camera.up.applyQuaternion(quaternion.setFromAxisAngle(axis, angle));
    }

    handleArea(event) {
        this.setState({
            settings: {
                minArea: parseFloat(event.target.value),
                maxVisibleDot: this.state.settings.maxVisibleDot
            }
        });
    }

    handleVisibleDot(event) {
        this.setState({
            settings: {
                minArea: this.state.settings.minArea,
                maxVisibleDot: parseFloat(event.target.value)
            }
        });
    }

    render() {
        return (
            <div id="componentsContainer">
                <div id="container">
                    <canvas id="WorldWindow" />
                    <div id="labels" />
                </div>
                <div>
                    <RangeComponent min={0} max={50} step={1} value={this.state.settings.minArea} handleChange={(e) => { this.handleArea(e) }} />
                    <RangeComponent min={-1} max={1} step={0.01} value={this.state.settings.maxVisibleDot} handleChange={(e) => { this.handleVisibleDot(e) }} />
                </div>
            </div>
        )
    }
}

export default WorldComponent;