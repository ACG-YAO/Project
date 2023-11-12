import * as THREE from 'three';
import { Ghost, Pumpkin, Inn, Lamp, Campfire, DeadTrees } from './Object';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { Scene, Color, Camera, Vector3, Fog, AudioListener, 
    Audio, AudioLoader } from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let cameraOffset = new THREE.Vector3(0, 2, 5);
renderer.setClearColor(0x00BFFF); 

let controls = new PointerLockControls(camera, renderer.domElement); 
scene.add(controls.getObject());

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

function createGroundGrid(size, spacing) {
    const halfSize = size / 2;

    for (let i = -halfSize; i <= halfSize; i++) {
        for (let j = -halfSize; j <= halfSize; j++) {
            const geometry = new THREE.PlaneGeometry(spacing, spacing);
            const color = new THREE.Color(Math.random(), Math.random(), Math.random());
            const material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(i * spacing, 0, j * spacing);
            mesh.rotateX(Math.PI / 2);  
            scene.add(mesh);
        }
    }
}

createGroundGrid(20, 1);

var fixedObjects = [];
var movableObjects = [];

const pumpkin = new Ghost(scene, (gltf) => {
    scene.add(gltf.scene);
});
fixedObjects.push(pumpkin);

const reward = new Pumpkin(scene,(gltf) => {
    gltf.scene.position.set(3,0,3);
    scene.add(gltf.scene);
});
fixedObjects.push(reward);

const Inn_1 = new Inn(scene, (gltf) => {
    gltf.scene.position.set(-6,0,-5);
    scene.add(gltf.scene);
});
fixedObjects.push(Inn_1);

const Inn_2 = new Inn(scene, (gltf) => {
    gltf.scene.position.set(-8,0,6);
    scene.add(gltf.scene);
});
fixedObjects.push(Inn_2);

const Inn_3 = new Inn(scene, (gltf) => {
    gltf.scene.position.set(-2,0,-7);
    scene.add(gltf.scene);
    gltf.scene.scale.set(0.8,0.8,0.8);
});
fixedObjects.push(Inn_3);


// const Lamp_1 = new Lamp(scene, (gltf) => {
//     gltf.scene.position.set(0,0,0);
//     scene.add(gltf.scene);
// });

const Campfire_1 = new Campfire(scene, (gltf) => {
    gltf.scene.position.set(-2.5,0.45,-3.6);
    scene.add(gltf.scene);
});
fixedObjects.push(Campfire_1);

const Campfire_2 = new Campfire(scene, (gltf) => {
    gltf.scene.position.set(-2,0.54,-4.5);
    scene.add(gltf.scene);
});
fixedObjects.push(Campfire_2);

const Campfire_3 = new Campfire(scene, (gltf) => {
    gltf.scene.position.set(-7.5,0.45,0);
    scene.add(gltf.scene);
});
fixedObjects.push(Campfire_3);

const Campfire_4 = new Campfire(scene, (gltf) => {
    gltf.scene.position.set(-7,0.54,1);
    gltf.scene.scale.set(1.2,1.2,1.3);
    scene.add(gltf.scene);
});
fixedObjects.push(Campfire_4);

const DeadTrees_0 = new DeadTrees(scene, (gltf) => {
    gltf.scene.position.set(9,0,-8);
    gltf.scene.scale.set(0.5,5,0.5);
    scene.add(gltf.scene);
});
fixedObjects.push(DeadTrees_0);
const DeadTrees_1 = new DeadTrees(scene, (gltf) => {
    gltf.scene.position.set(9,0,-8);
    scene.add(gltf.scene);
});
fixedObjects.push(DeadTrees_1);
const DeadTrees_2 = new DeadTrees(scene, (gltf) => {
    gltf.scene.position.set(8,0,-4);
    scene.add(gltf.scene);
});
fixedObjects.push(DeadTrees_2);
const DeadTrees_3 = new DeadTrees(scene, (gltf) => {
    gltf.scene.position.set(9.5,0,4);
    scene.add(gltf.scene);
});
fixedObjects.push(DeadTrees_3);
// const DeadTrees_4 = new DeadTrees(scene, (gltf) => {
//     gltf.scene.position.set(8,0,8);
//     scene.add(gltf.scene);
// });
// fixedObjects.push(DeadTrees_4);
const DeadTrees_5 = new DeadTrees(scene, (gltf) => {
    gltf.scene.position.set(8.5,0,0);
    scene.add(gltf.scene);
});
fixedObjects.push(DeadTrees_5);
// const DeadTrees_6 = new DeadTrees(scene, (gltf) => {
//     gltf.scene.position.set(6,0,8);
//     scene.add(gltf.scene);
// });
// fixedObjects.push(DeadTrees_6);
// // const DeadTrees_7 = new DeadTrees(scene, (gltf) => {
//     gltf.scene.position.set(3.5,0,8);
//     scene.add(gltf.scene);
// });
// fixedObjects.push(DeadTrees_7);
const DeadTrees_8 = new DeadTrees(scene, (gltf) => {
    gltf.scene.position.set(-2,0,8);
    scene.add(gltf.scene);
});
fixedObjects.push(DeadTrees_8);
// const DeadTrees_9 = new DeadTrees(scene, (gltf) => {
//     gltf.scene.position.set(0,0,8);
//     scene.add(gltf.scene);
// });
// fixedObjects.push(DeadTrees_9);


const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(light);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(1, 1, 1).normalize();
scene.add(dirLight);

camera.position.z = 20;

renderer.setSize(window.innerWidth, window.innerHeight);
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
renderer.setPixelRatio(window.devicePixelRatio);

document.addEventListener('keydown', (event) => {
    pumpkin.KeyDownHandler(event);
});

document.addEventListener('keyup', (event) => {
    pumpkin.KeyUpHandler(event);
});

function animate() {
    for (let i = 0; i < fixedObjects.length; i++) {
        fixedObjects[i].updateBoundary();
    }
    requestAnimationFrame(animate);

    if (pumpkin.object3D) {
        pumpkin.animate(fixedObjects);

        const relativeOffsetX = cameraOffset.z * Math.sin(pumpkin.object3D.rotation.y) + cameraOffset.x * Math.cos(pumpkin.object3D.rotation.y);
        const relativeOffsetZ = cameraOffset.z * Math.cos(pumpkin.object3D.rotation.y) - cameraOffset.x * Math.sin(pumpkin.object3D.rotation.y);

        camera.position.set(
            pumpkin.object3D.position.x - relativeOffsetX,
            pumpkin.object3D.position.y + cameraOffset.y,
            pumpkin.object3D.position.z - relativeOffsetZ
        );

        camera.lookAt(pumpkin.object3D.position);
    }

    for (let i = 0; i < fixedObjects.length; i++) {
        if (fixedObjects[i] == pumpkin) {
            continue;
        }
        fixedObjects[i].animate();
    }
    renderer.render(scene, camera);
}

let loadPromises =fixedObjects.map(object => {
    let loadPromise = object.getLoadPromise();
    console.log("Load Promise:", loadPromise);
    return loadPromise;
});

Promise.all(loadPromises).then(() => {
    animate(); 
}).catch(error => {
    console.error("An error occurred while loading objects:", error);
});