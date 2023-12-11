import * as THREE from 'three';
import { Ghost, Pumpkin, Fence, ReversedFence } from './Object';
import { RandomGeneratedMap } from './Map';
import { SwitchableCamera } from './Camera';
import { TimeStamp, WinIndicator, LoseIndicator } from './utils';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x00BFFF); 
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);


// Load audio
// var listener = new THREE.AudioListener();
// camera.add( listener );
// var sound = new THREE.Audio( listener );
// var audioLoader = new THREE.AudioLoader();
// audioLoader.load( 'Audio/meow.mp3', function( buffer ) {
//     sound.setBuffer( buffer );
//     sound.setLoop( true );
//     sound.setVolume( 0.5 );
//     sound.pause();
// });

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


const totaltime = 15000;
const Finalscore = 1;

const winIndicator = new WinIndicator();
const loseIndicator = new LoseIndicator();

const rewardcount = new Reward(Finalscore, winIndicator);
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

window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.getCamera().aspect = window.innerWidth / window.innerHeight;
    camera.getCamera().updateProjectionMatrix();
});
document.addEventListener('click', function () {
    controls.lock();
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
    ghost.animate(map.scene, fixedObjects);
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
    animate(); 
}).catch(error => {
    console.log(loadPromises);
    console.error("An error occurred while loading objects:", error);
});