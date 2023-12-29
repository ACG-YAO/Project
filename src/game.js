import * as THREE from 'three';
import { Ghost, Pumpkin, Fence, ReversedFence } from './Object';
import { RandomGeneratedMap } from './Map';
import { SwitchableCamera } from './Camera';
import { TimeStamp, LoseIndicator, WinIndicator } from './utils';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';

export class Game {
    constructor() {
        this.locked = true;
        this.playing = false;
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.listener = new THREE.AudioListener();
        this.audioLoader = new THREE.AudioLoader();
        this.backgroundMusic = new THREE.Audio(this.listener);
        this.goalMusic = new THREE.Audio(this.listener);
        this.winMusic = new THREE.Audio(this.listener);
        this.loseMusic = new THREE.Audio(this.listener);
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
        this.audioLoader.load('Audio/win.mp3', (buffer) => {
            this.winMusic.setBuffer(buffer);
            this.winMusic.setLoop(false);
            this.winMusic.setVolume(5.0);
        });
        this.audioLoader.load('Audio/lose.mp3', (buffer) => {
            this.loseMusic.setBuffer(buffer);
            this.loseMusic.setLoop(false);
            this.loseMusic.setVolume(1.0);
        });
        this.mazeSize = 50;
        this.numRewards = 18;
        this.exclusionZoneSize = 5;
        this.scaleSize = 4;
        this.totaltime = 600000;
        this.animate = this.animate.bind(this);
        this.finalScore = 19;
        this.control = {
            'forward': 'KeyW',
            'backward': 'KeyS',
            'left': 'KeyA',
            'right': 'KeyD',
            'map': 'KeyM',
            'pause': 'KeyL',
            'changeview': 'KeyR'
        };
        this.audio = 'on';
    }

    initialize() {
        if (this.playing)
            this.stop();
        this.score = 0;
        this.renderer.domElement.style.display = 'block';
        let game_bar = document.getElementById('game');
        game_bar.style.setProperty('--p', Math.round(100 * this.score / this.numRewards));
        game_bar.style.setProperty('--user-content', `'${this.score.toString()}/${this.numRewards.toString()}'`);
        this.map = new RandomGeneratedMap(this.mazeSize, this.numRewards, this.exclusionZoneSize, this.scaleSize);
        this.map.setProtagonist(Ghost);
        this.map.setFence(Fence);
        this.map.setReversedFence(ReversedFence);
        this.map.setReward(Pumpkin);
        this.map.initialize();

        this.sky = new Sky();
        this.sky.scale.setScalar(450000);
        this.map.scene.add(this.sky);
        this.sunSphere = new THREE.Mesh(
            new THREE.SphereGeometry(15000, 16, 8),
            new THREE.MeshBasicMaterial({ color: 0xffaa00 })
        );
        this.sunSphere.position.y = - 700000;
        this.sunSphere.visible = false;
        this.map.scene.add(this.sunSphere);
        var uniforms = this.sky.material.uniforms;
        uniforms['turbidity'].value = 6;
        uniforms['rayleigh'].value = 2;
        uniforms['mieCoefficient'].value = 0.003;
        uniforms['mieDirectionalG'].value = 0.5;
        var theta = Math.PI * (0.48 - 0.5);
        var phi = 2 * Math.PI * (0.25 - 0.5);
        this.sunSphere.position.x = 400000 * Math.cos(phi);
        this.sunSphere.position.y = 400000 * Math.sin(phi) * Math.sin(theta);
        this.sunSphere.position.z = 400000 * Math.sin(phi) * Math.cos(theta);
        this.sunSphere.visible = true;
        uniforms['sunPosition'].value.copy(this.sunSphere.position);

        this.cameraOffset = new THREE.Vector3(0, 2, 5);
        this.cameraPosition = new THREE.Vector3(0, 0, 20);
        this.camera = new SwitchableCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000, this.cameraOffset, this.cameraPosition);
        this.controls = new PointerLockControls(this.camera.getCamera(), this.renderer.domElement);
        this.map.scene.add(this.controls.getObject());
        this.loseIndicator = new LoseIndicator(this.audio, this.loseMusic, this.backgroundMusic);
        this.winIndicator = new WinIndicator();
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
        this.resetController();
    }

    resetController() {
        if (this.camera) {
            this.camera.resetController(this.control['map'], this.control['changeview']);
        }
        if (this.ghost) {
            this.ghost.resetController(this.control['forward'], this.control['backward'], this.control['left'], this.control['right']);
        }
    }

    pauseAllMedia() {
        if (this.backgroundMusic.isPlaying) {
            this.backgroundMusic.pause();
        }
    }

    toggleSounds() {
        if (!this.backgroundMusic.isPlaying) {
            this.backgroundMusic.play();
        }
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
        this.renderer.clear();
        this.renderer.domElement.style.display = 'none';
        if (this.map && this.map.scene) {
            this.disposeScene(this.map.scene);
        }
        this.sky.material.dispose();
        this.sky.geometry.dispose();
        this.map.scene.remove(this.sky);
        this.sky = null;
        this.disposeObject(this.sunSphere);
        this.map.scene.remove(this.sunSphere);
        this.sunSphere = null;
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
        this.winIndicator = null;
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
                let game_bar = document.getElementById('game');
                game_bar.style.setProperty('--p', Math.round(100 * this.score / this.numRewards));
                game_bar.style.setProperty('--c', `'${this.score.toString()}/${this.numRewards.toString()}'`);
                if (this.audio === 'on'){
                    this.goalMusic.play();
                }
                if (this.score === this.finalScore) {
                    this.locked = true;
                    this.controls.unlock();
                    this.winIndicator.display();
                    if (this.audio === 'on'){
                        this.backgroundMusic.pause();
                        setTimeout(() => {
                            this.winMusic.play();
                        }, 1000);
                        setTimeout(() => {
                            this.backgroundMusic.play();
                        }, 5000);
                    }
                }
            }
            this.map.updateAgentLocation(this.ghost.object3D.position);
            this.camera.animate(this.ghost.object3D.position, this.ghost.object3D.rotation);
            for (let i = 0; i < fixedObjects.length; i++) {
                fixedObjects[i].animate();
            }
            for (let i = 0; i < this.map.waterObjectsList.length; i++) {
                this.map.waterObjectsList[i].material.uniforms['time'].value += 1 / 120;
            }
            this.renderer.render(this.map.scene, this.camera.getCamera());
        }
        this.requestID = requestAnimationFrame(this.animate);
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