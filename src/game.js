import * as THREE from 'three';
import { Ghost, Pumpkin, Fence, ReversedFence } from './Object';
import { RandomGeneratedMap } from './Map';
import { SwitchableCamera } from './Camera';
import { TimeStamp, LoseIndicator } from './utils';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export class Game {
    constructor() {
        this.locked = true;
        this.playing = false;
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.renderer.setClearColor(0x00BFFF);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.listener = new THREE.AudioListener();
        this.audioLoader = new THREE.AudioLoader();
        this.backgroundMusic = new THREE.Audio(this.listener);
        this.goalMusic = new THREE.Audio(this.listener);
        this.audioLoader.load('Audio/background.mp3', (buffer) => {
            this.backgroundMusic.setBuffer(buffer);
            this.backgroundMusic.setLoop(true);
            this.backgroundMusic.setVolume(1.0);
            this.backgroundMusic.play();
        });
        this.audioLoader.load('Audio/goal.mp3', (buffer) => {
            this.goalMusic.setBuffer(buffer);
            this.goalMusic.setLoop(false);
            this.goalMusic.setVolume(1.0);
        });
        this.mazeSize = 50;
        this.numRewards = 18;
        this.exclusionZoneSize = 5;
        this.scaleSize = 4;
        this.totaltime = 3000;
        this.animate = this.animate.bind(this);
        this.finalScore = 19;
    }

    initialize() {
        if (this.playing)
            this.stop();
        this.score = 0;
        document.getElementById('score').textContent = this.score;
        this.map = new RandomGeneratedMap(this.mazeSize, this.numRewards, this.exclusionZoneSize, this.scaleSize);
        this.map.setProtagonist(Ghost);
        this.map.setFence(Fence);
        this.map.setReversedFence(ReversedFence);
        this.map.setReward(Pumpkin);
        this.map.initialize();

        this.cameraOffset = new THREE.Vector3(0, 2, 5);
        this.cameraPosition = new THREE.Vector3(0, 0, 20);
        this.camera = new SwitchableCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000, this.cameraOffset, this.cameraPosition);
        this.controls = new PointerLockControls(this.camera.getCamera(), this.renderer.domElement);
        this.map.scene.add(this.controls.getObject());
        this.loseIndicator = new LoseIndicator();
        this.timeStamp = new TimeStamp(this.totaltime, this.loseIndicator, this.lock.bind(this));
        this.ghost = new Ghost(this.map.scene, (gltf) => {
            gltf.scene.position.set(0, 0, 0);
            this.map.scene.add(gltf.scene);
        });
        this.map.pushMovableObjects(this.ghost);
        this.light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
        this.map.scene.add(this.light);
        this.dirLight = new THREE.DirectionalLight(0xffffff, 1);
        this.dirLight.position.set(1, 1, 1).normalize();
        this.map.scene.add(this.dirLight);
        this.playing = true;
    }

    disposeObject(obj) {
        if (obj.geometry) {
            obj.geometry.dispose();
        }
        if (obj.material) {
            if (obj.material.length) {
                for (let i = 0; i < obj.material.length; ++i) {
                    obj.material[i].dispose();
                }
            } else {
                obj.material.dispose();
            }
        }
        if (obj.dispose) {
            obj.dispose();
        }
    }

    disposeScene(scene) {
        scene.traverse(obj => this.disposeObject(obj));
    }

    lock() {
        this.locked = true;
    }

    stop() {
        this.playing = false;
        if (this.map && this.map.scene) {
            this.disposeScene(this.map.scene);
        }
        this.ghost = null;
        this.map.scene.remove(this.controls.getObject());
        this.controls = null;
        this.cameraOffset = null;
        this.cameraPosition = null;
        this.camera = null;
        this.map.scene.remove(this.light);
        this.light = null;
        this.map.scene.remove(this.dirLight);
        this.dirLight = null;
        this.timeStamp = null;
        this.loseIndicator = null;
        this.map = null;
    }

    animate() {
        if (this.locked === false) {
            let fixedObjects = this.map.getFixedObjects();
            for (let i = 0; i < fixedObjects.length; i++) {
                fixedObjects[i].updateBoundary();
            }
            if (this.ghost.animate(this.map.scene, fixedObjects)) {
                this.score++;
                document.getElementById('score').textContent = this.score;
                this.goalMusic.play();
            }
            this.map.updateAgentLocation(this.ghost.object3D.position);
            this.camera.animate(this.ghost.object3D.position, this.ghost.object3D.rotation);
            for (let i = 0; i < fixedObjects.length; i++) {
                fixedObjects[i].animate();
            }
            for (let i = 0; i < this.map.waterObjectsList.length; i++) {
                this.map.waterObjectsList[i].material.uniforms['time'].value += 1 / 60;
            }
            this.renderer.render(this.map.scene, this.camera.getCamera());
        }
        requestAnimationFrame(this.animate);
    }

    start() {
        this.timeStamp.start();
        this.locked = false;
        this.controls.lock();
        let loadPromises = this.map.getFixedObjects().map(object => {
            let loadPromise = object.getLoadPromise();
            return loadPromise;
        });
        Promise.all(loadPromises).then(() => {
            this.animate();
        }).catch(error => {
            console.log(loadPromises);
            console.error("An error occurred while loading objects:", error);
        });
    }

    pause() {
        this.timeStamp.pause();
        this.locked = true;
        this.controls.unlock();
    }

    resume() {
        this.timeStamp.start();
        this.locked = false;
        this.controls.lock();
    }

    WindowResizeHandler() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        if (this.playing) {
            this.camera.getCamera().aspect = window.innerWidth / window.innerHeight;
            this.camera.getCamera().updateProjectionMatrix();
        }
    }

    KeyDownHandler(event) {
        if (this.playing) {
            this.ghost.KeyDownHandler(event);
            this.camera.KeyDownHandler(event);
        }     
    }

    KeyUpHandler(event) {
        if (this.playing) {
            this.ghost.KeyUpHandler(event);
            this.camera.KeyUpHandler(event);
        }   
    }

    MouseClickHandler() {
        if (this.backgroundMusic.context.state === 'suspended') {
            this.backgroundMusic.context.resume();
            this.backgroundMusic.play();
        }
    }

    MouseDownHandler(event) {
        if (this.playing) {
            this.camera.MouseDownHandler(event);
        }
    }

    MouseUpHandler(event) {
        if (this.playing) {
            this.camera.MouseUpHandler(event);
        }
    }

    MouseMoveHandler(event) {
        if (this.playing) {
            this.camera.MouseMoveHandler(event);
        }
    }
}

export default Game;