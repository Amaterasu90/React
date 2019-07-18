import React, { Component } from 'react';
import * as THREE from 'three';
import RangeComponent from './rangeComponent/RangeComponent.jsx';

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

        this.WebGL = {
            objects: []
        };

        this.speed = 0;
    }

    initializeScene() {
        var scene = new THREE.Scene();
        if (this.WebGL.objects.filter(o => o.type === "scene").length === 0) {
            this.WebGL.objects.push({ name: "mainScene", scene: scene, type: "scene" });
        }
    }

    addCamera(name) {
        var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.WebGL.objects.push({ name: name, camera: camera, type: "camera" });
    }

    initializeRenderer() {
        var renderer = new THREE.WebGLRenderer();
        if (this.WebGL.objects.filter(o => o.type === "renderer").length === 0) {
            this.WebGL.objects.push({ name: "mainRenderer", renderer: renderer, type: "renderer" });
        }
    }

    getRenderer() {
        return this.WebGL.objects.filter(o => o.type === "renderer")[0].renderer;
    }

    getScene() {
        return this.WebGL.objects.filter(o => o.type === "scene")[0].scene;
    }

    getCameraByName(name) {
        var result = this.WebGL.objects.filter(o => o.type === "camera" && o.name === name);
        if (result.length === 1) {
            return result[0].camera;
        }
    }

    sceneSetup() {
        this.initializeScene();
        this.addCamera("camera1");
        this.initializeRenderer();
        var renderer = this.getRenderer();
        renderer.setClearColor(0xffffff);
        renderer.setSize(this.props.width, this.props.heigth);
        this.mount.appendChild(renderer.domElement);
    };

    addDirectionalLight(name, color, intesity) {
        var directionalLight = new THREE.DirectionalLight(color, intesity);
        this.WebGL.objects.push({ name: name, directionalLight: directionalLight, type: "directionalLight" });
    }

    getDirectionalLight(name) {
        var result = this.WebGL.objects.filter(o => o.type === "directionalLight" && o.name === name);
        if (result.length === 1) {
            return result[0].directionalLight;
        }
    }

    addMesh(name, geometry, material) {
        var mesh = new THREE.Mesh(geometry, material);
        this.WebGL.objects.push({ name: name, mesh: mesh, type: "mesh" });
    }

    getMesh(name) {
        var result = this.WebGL.objects.filter(o => o.type === "mesh" && o.name === name);
        if (result.length === 1) {
            return result[0].mesh;
        }
    }

    addToScene(findCallback) {
        var scene = this.getScene();
        var element3d = findCallback();
        if (scene && element3d) {
            scene.add(element3d);
        }
    }

    addCustomSceneObjects() {
        this.addMesh("cube1", new THREE.BoxGeometry(2, 2, 2), new THREE.MeshLambertMaterial({ color: 0x00ff00 }));
        this.getMesh("cube1").position.x = 3;

        this.addMesh("cube2", new THREE.BoxGeometry(2, 2, 2), new THREE.MeshLambertMaterial({ color: 0x0000ff }));
        this.getMesh("cube2").position.x = -3;

        this.addDirectionalLight("directionalLight1", 0xFFFFFF, 1);
        var directionalLight = this.getDirectionalLight("directionalLight1");
        directionalLight.position.set(100, 350, 250);
        directionalLight.castShadow = true;

        this.addToScene(() => this.getDirectionalLight("directionalLight1"));
        this.addToScene(() => this.getMesh("cube1"));
        this.addToScene(() => this.getMesh("cube2"));
        this.getCameraByName("camera1").position.z = 10;
        this.setState({
            WebGL: this.WebGL
        })
    };

    startAnimationLoop() {
        this.getRenderer().setAnimationLoop(() => {
            this.update();
            this.getRenderer().render(this.getScene(), this.getCameraByName("camera1"));
        });
    };

    componentDidMount() {
        this.sceneSetup();
        this.addCustomSceneObjects();
        this.startAnimationLoop();
    }

    componentWillUnmount() {
    }

    onDocMouseDown(event) {
        const mouse3D = new THREE.Vector2(
            (event.clientX / this.props.width) * 2 - 1,
            -(event.clientY / this.props.width) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse3D, this.getCameraByName("camera1"));
        var meshesToIntersect = this.WebGL.objects.filter(o => o.type === "mesh").map(o => o.mesh);
        let intersects = raycaster.intersectObjects(meshesToIntersect);

        if (intersects.length > 0) {
            intersects[0].object.material.color.setHex(Math.random() * 0xffffff)
        }
    }

    buttonClick(event) {
        this.getMesh("cube1").material.color.setHex(Math.random() * 0xff00ff);
        this.speed += 0.01;
    }

    update() {
        this.WebGL.objects.filter(o => o.type === "mesh").map(o => o.mesh).forEach(e => {
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
                <div onClick={e => this.onDocMouseDown(e)}
                    ref={ref => (this.mount = ref)} />
                <button onClick={e => this.buttonClick(e)}>Click me</button>
                <RangeComponent handleChange={event => this.handleChange(event)} min={-0.01} max={0.01} step={0.0001} startValue={0} />
            </div>
        )
    }
}

export default ThreeComponent;