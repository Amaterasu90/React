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

import CountryContoures from './country-outlines-4k.png';
import CountryAreas from './country-index-texture.png';
import CountriesInfo from '../../dataProcessing/CountriesInfo.jsx';

import './style.css';
import RangeComponent from '../rangeComponent/RangeComponent.jsx';
import CountryInfoMapper from '../../dataProcessing/countryInfoMapper.jsx';
import ElementCreator from '../../html/ElementCreator.jsx';
import ElementReciever from '../../html/ElementReciever.jsx';
import ElementEmbedder from '../../html/ElementEmbedder.jsx';
import SceneCreator from '../../webgl/scene/SceneCreator.jsx';
import Picker from '../../webgl/utils/Picker.jsx';

class CountryPickerComponent extends Component {
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
        this.sceneCreator = new SceneCreator(this.worldObjectManager, this.sceneReciever);
        this.rendererInitializer = new RendererInitializer(this.worldObjectManager, this.rendererReciever);
        this.worldCreator = new WorldCreator(this.worldManager);
        this.plugin = new ThreejsWindowPlugin(this.rendererInitializer, this.rendererReciever);
        this.sceneManager = new SceneManager(this.sceneReciever);
        this.labeledMeshCreator = new LabeledMeshCreator(this.worldObjectManager, this.meshReciever);
        this.speed = 0;
        this.tempV = new THREE.Vector3();
        this.meshIntersector = new MeshIntersector(this.cameraReciever);

        this.pickHelper = new Picker(this.rendererReciever);
        this.renderRequested = false;
        this.tempV = new THREE.Vector3();
        this.cameraToPoint = new THREE.Vector3();
        this.cameraPosition = new THREE.Vector3();
        this.normalMatrix = new THREE.Matrix3();

        this.matrix = new THREE.Matrix4();
        this.euler = new THREE.Euler(0, 0, 0, 'XYZ');
        this.state = {
            settings: {
                minArea: 10,
                maxVisibleDot: -0.2,
            }
        };

        this.lastTouch = null;
        this.numCountriesSelected = 0;
    }

    animationFrame(time) {
        this.update(time);
        this.rendererReciever.recieve().render(this.sceneReciever.recieveFirst(), this.cameraReciever.recieveFirst());
    }

    componentDidMount() {
        this.canvas = document.querySelector("#WorldWindow");
        this.worldCreator.createDefault(() => {
            this.plugin.embed(this.canvas, parseInt(this.props.width), parseInt(this.props.width));
        });

        this.sceneCreator.create("pickingScene");
        var scene = this.sceneReciever.recieve("pickingScene");
        scene.background = new THREE.Color(0);

        new RendererBuilder(this.rendererReciever)
            .setClearColor("#236")
            .setAnimationLoop((time) => { this.animationFrame(time) }).build();

        const loader = new THREE.TextureLoader();
        const countryContoures = loader.load(CountryContoures);
        const countryAreas = loader.load(CountryAreas);
        countryAreas.minFilter = THREE.NearestFilter;
        countryAreas.magFilter = THREE.NearestFilter;

        new SceneBuilder(
            this.sceneManager,
            this.meshReciever,
            this.meshCreator,
            this.cameraCreator,
            this.lightReciever,
            this.directionalLightCreator,
            this.cameraReciever,
            this.labeledMeshCreator)
            .addMesh("contoures", new THREE.SphereBufferGeometry(1, 64, 32), new THREE.MeshBasicMaterial({ color: 0x00ff00, map: countryContoures }))
            .addMesh("contoures", new THREE.SphereBufferGeometry(1, 64, 32), new THREE.MeshBasicMaterial({ map: countryAreas }))
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

        var htmlElementCreator = new ElementCreator(document);
        var mapper = new CountryInfoMapper(htmlElementCreator);
        this.countries = mapper.map(CountriesInfo);
        var htmlReciever = new ElementReciever(document);
        var labelsParenElement = htmlReciever.recieveBySelector('#labels');
        var htmlEmbeder = new ElementEmbedder(labelsParenElement);

        this.countries.forEach(country => {
            htmlEmbeder.embed(country.elem);
        });

        this.requestRenderIfNotRequested();

        this.controls.addEventListener('change', () => { this.requestRenderIfNotRequested() });
        this.canvas.addEventListener('mouseup', this.pickCountry.bind(this));

        this.canvas.addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.lastTouch = event.touches[0];
          }, {passive: false});
          this.canvas.addEventListener('touchsmove', (event) => {
            this.lastTouch = event.touches[0];
          });
          this.canvas.addEventListener('touchend', () => {
            this.pickCountry(this.lastTouch);
          });
    }   

    pickCountry(event) {
        if (!this.countries) {
            return;
        }

        const position = { x: event.clientX, y: event.clientY };
        const id = this.pickHelper.pick(position, this.sceneReciever.recieve("pickingScene"), this.cameraReciever.recieveFirst());        
        debugger;
        if (id > 0) {
            const countryInfo = this.countries[id - 1];
            const selected = !countryInfo.selected;
            if (selected && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
                unselectAllCountries();
            }
            this.numCountriesSelected += selected ? 1 : -1;
            countryInfo.selected = selected;
        } else if (this.numCountriesSelected) {
            this.unselectAllCountries();
        }
        this.requestRenderIfNotRequested();
    }

    unselectAllCountries() {
        this.numCountriesSelected = 0;
        this.countries.forEach((countryInfo) => {
            countryInfo.selected = false;
        });
    }

    requestRenderIfNotRequested() {
        if (!this.renderRequested) {
            this.renderRequested = true;
            this.updateLabels();
        }
    }

    updateLabels(time) {
        if (!this.countries) {
            return;
        }

        // var mesh = this.meshReciever.recieve("contoures");
        // this.euler.setFromQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.001));
        // mesh.rotation.x = this.euler.x;
        // mesh.rotation.y += this.euler.y;
        // mesh.rotation.z = this.euler.z;

        var camera = this.cameraReciever.recieveFirst();
        this.normalMatrix.getNormalMatrix(camera.matrixWorldInverse);
        camera.getWorldPosition(this.cameraPosition);

        for (const countryInfo of this.countries) {
            const {position, elem, area, selected} = countryInfo;
            const largeEnough = area >= 300;
            const show = selected || (this.numCountriesSelected === 0 && largeEnough);
            if (!show) {
              elem.style.display = 'none';
              continue;
            }

            //this.tempV.copy(position.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.001)));
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
    }

    handleArea(event) {
        console.log(parseFloat(event.target.value));
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
                    <RangeComponent description={"maxium visible dot"} min={-1} max={1} step={0.01} value={this.state.settings.maxVisibleDot} handleChange={(e) => { this.handleVisibleDot(e) }} />
                </div>
            </div>
        )
    }
}

export default CountryPickerComponent;