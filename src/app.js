import * as THREE from 'three';
import { Ghost, Pumpkin, Fence, ReversedFence } from './Object';
import { RandomGeneratedMap } from './Map';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';


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

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let cameraOffset = new THREE.Vector3(0, 2, 5);
renderer.setClearColor(0x00BFFF); 

let controls = new PointerLockControls(camera, renderer.domElement); 
map.scene.add(controls.getObject());

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




function findfire(maze) {
    const zones = [];
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
          if (maze[y][x] === 0) {
            zones.push({ x, y });
            maze[y][x] = 4;
          }
        }
    }
    return zones;
}

function findAllSurroundedByOne(maze) {
    const surroundedCells = [];
  
    for (let y = 1; y < maze.length - 1; y++) {
      for (let x = 1; x < maze[y].length - 1; x++) {
        // Check if all neighbors of maze[y][x] are 1
        if (maze[y][x] === 0){
          if (
          maze[y - 1][x] === 1 || // North
          maze[y + 1][x] === 1 || // South
          maze[y][x - 1] === 1 || // West
          maze[y][x + 1] === 1 || // East
          maze[y - 1][x - 1] === 1 || // Northwest
          maze[y - 1][x + 1] === 1 || // Northeast
          maze[y + 1][x - 1] === 1 || // Southwest
          maze[y + 1][x + 1] === 1 // Southeast
          ) {
          surroundedCells.push({ x, y });
          }  
        }
      }
    }
    return surroundedCells;
}



function findlargearea(maze) {
    const zones = [];
    const largesize = 2;
    const largehalfSize = Math.floor(largesize / 2);
  
    // Start at halfSize to ensure we can check a full 7x7 area without going out of bounds
    for (let y = largehalfSize; y < maze.length - largehalfSize; y++) {
      for (let x = largehalfSize; x < maze[y].length - largehalfSize; x++) {
        let isAllZero = true;
  
        // Check the 7x7 area centered at (x, y)
        for (let i = -largehalfSize; i <= largehalfSize; i++) {
          for (let j = -largehalfSize; j <= largehalfSize; j++) {
            if (maze[y + i][x + j] !== 0) {
              isAllZero = false;
              break;
            }
          }
          if (!isAllZero) break;
        }
  
        // If the 7x7 area is all zeros, add the center point to the list
        if (isAllZero) {
            for (let i = -largehalfSize; i <= largehalfSize; i++) {
              for (let j = -largehalfSize; j <= largehalfSize; j++) {
                maze[y + i][x + j] = 4;
              }
            }
            // Optionally add the center point to the zones array
            zones.push({ x, y });
        }
      }
    }
  
    return zones;
}
// place Inn

// const centers = findlargearea(maze);
  
// centers.forEach(center => {
//   const Inn = new Inn(scene, (gltf) => {
//     gltf.scene.position.set(scale_size * (center.x - halfSize), 0, scale_size * (center.y - halfSize)); 
//     scene.add(gltf.scene);
//   });
//   fixedObjects.push(Inn);
// });


const ghost = new Ghost(map.scene, (gltf) => {
    gltf.scene.position.set(0, 0, 0);
    map.scene.add(gltf.scene);
});
map.pushFixedObjects(ghost);

const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
map.scene.add(light);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(1, 1, 1).normalize();
map.scene.add(dirLight);

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
    ghost.KeyDownHandler(event);
});

document.addEventListener('keyup', (event) => {
    ghost.KeyUpHandler(event);
});

function animate() {
    let fixedObjects = map.getFixedObjects();
    for (let i = 0; i < fixedObjects.length; i++) {
        fixedObjects[i].updateBoundary();
    }
    requestAnimationFrame(animate);

    if (ghost.object3D) { 
        ghost.animate(map.scene, fixedObjects);

        const relativeOffsetX = cameraOffset.z * Math.sin(ghost.object3D.rotation.y) + cameraOffset.x * Math.cos(ghost.object3D.rotation.y);
        const relativeOffsetZ = cameraOffset.z * Math.cos(ghost.object3D.rotation.y) - cameraOffset.x * Math.sin(ghost.object3D.rotation.y);

        camera.position.set(
            ghost.object3D.position.x - relativeOffsetX,
            ghost.object3D.position.y + cameraOffset.y,
            ghost.object3D.position.z - relativeOffsetZ
        );

        camera.lookAt(ghost.object3D.position);
    }

    for (let i = 0; i < fixedObjects.length; i++) {
        if (fixedObjects[i] == ghost) {
            continue;
        }
        fixedObjects[i].animate();
    }
    renderer.render(map.scene, camera);
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