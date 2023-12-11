import * as THREE from 'three';
import { Ghost, Pumpkin, Fence, ReversedFence } from './Object';
import { RandomGeneratedMap } from './Map';
import { SwitchableCamera } from './Camera';
import { TimeStamp, WinIndicator, LoseIndicator } from './utils';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

let locked = false;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x00BFFF); 
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);


var listener = new THREE.AudioListener();
var audioLoader = new THREE.AudioLoader();
var backgroundMusic = new THREE.Audio(listener);
var goalMusic = new THREE.Audio(listener);
audioLoader.load('Audio/background.mp3', function (buffer) {
    backgroundMusic.setBuffer(buffer);
    backgroundMusic.setLoop(true);
    backgroundMusic.setVolume(1.0);
    backgroundMusic.play();
 });

audioLoader.load('Audio/goal.mp3', function (buffer) {
    goalMusic.setBuffer(buffer);
    goalMusic.setLoop(false);
    goalMusic.setVolume(1.0);
});

const mazeSize = 50;
const numRewards = 18;
const exclusionZoneSize = 5;
const scaleSize = 4;
const map = new RandomGeneratedMap(mazeSize, numRewards, exclusionZoneSize, scaleSize);
map.setProtagonist(Ghost);
map.setFence(Fence);
map.setReversedFence(ReversedFence);
map.setReward(Pumpkin);
map.initialize();

let cameraOffset = new THREE.Vector3(0, 2, 5);
let cameraPosition = new THREE.Vector3(0, 0, 20);
const camera = new SwitchableCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000, cameraOffset,cameraPosition);
let controls = new PointerLockControls(camera.getCamera(), renderer.domElement);
map.scene.add(controls.getObject());


const totaltime = 600000;
const loseIndicator = new LoseIndicator();
const timeStamp = new TimeStamp(totaltime, loseIndicator);
timeStamp.start();

const ghost = new Ghost(map.scene, (gltf) => {
    gltf.scene.position.set(0, 0, 0);
    map.scene.add(gltf.scene);
});
map.pushMovableObjects(ghost);

const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
map.scene.add(light);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(1, 1, 1).normalize();
map.scene.add(dirLight);

window.addEventListener("load", function() {
    document.getElementById("loadingScreen").style.display = 'none';
    document.getElementById("backScreen").style.display = 'none';

    document.getElementById("startButton").addEventListener("click", function() {
        locked = false;
        document.getElementById("startScreen").style.display = 'none';
        document.getElementById("loadingScreen").style.display = 'flex';
        setTimeout(function() {
            document.getElementById("loadingScreen").style.display = 'none';
        }, 2000); 
    });

    document.getElementById("ruleButton").addEventListener("click", function() {
        document.getElementById("startScreen").style.display = 'none';
        document.getElementById("backScreen").style.display = 'flex';
    });

    document.getElementById("backButton").addEventListener("click", function() {
        document.getElementById("backScreen").style.display = 'none';
        document.getElementById("startScreen").style.display = 'flex';
    });

});

window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.getCamera().aspect = window.innerWidth / window.innerHeight;
    camera.getCamera().updateProjectionMatrix();
});
document.addEventListener('click', function () {
    controls.lock();
    if (backgroundMusic.context.state === 'suspended') {
        backgroundMusic.context.resume();
        backgroundMusic.play(); 
    }
}, false);


document.addEventListener('keydown', (event) => {
    ghost.KeyDownHandler(event);
    camera.KeyDownHandler(event);
});

document.addEventListener('keyup', (event) => {
    ghost.KeyUpHandler(event);
    camera.KeyUpHandler(event);
});

document.addEventListener('mousedown', function (event) {
    camera.MouseDownHandler(event);
});

document.addEventListener('mousemove', function (event) {
    camera.MouseMoveHandler(event);
});

document.addEventListener('mouseup', function (event) {
    camera.MouseUpHandler(event);
});

function animate() {
    let fixedObjects = map.getFixedObjects();
    for (let i = 0; i < fixedObjects.length; i++) {
        fixedObjects[i].updateBoundary();
    }
    requestAnimationFrame(animate);
    if (ghost.animate(map.scene, fixedObjects)) {
        goalMusic.play();
    }
    map.updateAgentLocation(ghost.object3D.position);
    camera.animate(ghost.object3D.position, ghost.object3D.rotation);
    for (let i = 0; i < fixedObjects.length; i++) {
        fixedObjects[i].animate();
    }
    for (let i = 0; i < map.waterObjectsList.length; i++) {
        map.waterObjectsList[i].material.uniforms['time'].value += 1/60;
    }
    renderer.render(map.scene, camera.getCamera());
}

let loadPromises = map.getFixedObjects().map(object => {
    let loadPromise = object.getLoadPromise();
    return loadPromise;
});

Promise.all(loadPromises).then(() => {
    if (locked === false){
        animate(); 
    }
}).catch(error => {
    console.log(loadPromises);
    console.error("An error occurred while loading objects:", error);
});