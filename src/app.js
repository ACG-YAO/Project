import * as THREE from 'three';
import { Ghost, Pumpkin, Inn, Fence, ReversedFence, Campfire, DeadTrees } from './Object';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
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


function createGroundGrid(maze, size, spacing) {
    const halfSize = size / 2;

    for (let i = -halfSize; i < halfSize; i++) {
        for (let j = -halfSize; j < halfSize; j++) {
            const geometry = new THREE.PlaneGeometry(spacing, spacing);
            let color;
            switch(maze[j + halfSize][i + halfSize]) {
              case 0: 
                //color = new THREE.Color(Math.random(), Math.random(), Math.random());
                color = new THREE.Color('white');
                break;
              case 1: 
                color = new THREE.Color('gray');
                break;
              case 2: 
                color = new THREE.Color('gold');
                break;
              case 3:
                color = new THREE.Color('red');
                break;
              case 4:
                color = new THREE.Color('pink');
                break;
            }
            //const color = new THREE.Color(Math.random(), Math.random(), Math.random());
            const material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(i * spacing, 0, j * spacing);
            mesh.rotateX(Math.PI / 2);  
            scene.add(mesh);
        }
    }
}
function generateMazeWithRewards(size, rewardCount, exclusionSize) {
    const maze = Array.from({ length: size }, () => Array(size).fill(0));
    const halfSize = size / 2;
    const excludeStart = halfSize - exclusionSize / 2;
    const excludeEnd = halfSize + exclusionSize / 2;
  
    // Check if the coordinates are within the exclusion zone
    function isInExclusionZone(x, y) {
      return x >= excludeStart && x < excludeEnd && y >= excludeStart && y < excludeEnd;
    }
  
    // Randomly place rewards, avoiding the exclusion zone
    const rewards = [];
    while (rewards.length < rewardCount) {
        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);
        
        // Check if the new position is sufficiently far from existing rewards
        const isFarEnough = rewards.every((reward) => {
            return Math.abs(reward.x - x) + Math.abs(reward.y - y) > 10;
        });

        if (!isInExclusionZone(x, y) && isFarEnough) {
            rewards.push({ x, y });
        }
    }
  
    // Create a random path between two points
    function createRandomPath(start, end) {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const dist = Math.abs(dx) + Math.abs(dy);
      let steps = 0;
  
      let current = { ...start };
      while ((current.x !== end.x || current.y !== end.y) && steps < dist * 2) {
        maze[current.y][current.x] = 1; // Mark the current spot as a path
  
        // Randomly choose to move in x or y direction
        if (Math.random() < 0.5 && current.x !== end.x) {
          current.x += Math.sign(dx);
        } else if (current.y !== end.y) {
          current.y += Math.sign(dy);
        }
        steps++;
      }
  
      // Ensure the end point is marked as a path if the loop exits early
      maze[end.y][end.x] = 1;
    }
  
    // Create paths between all rewards
    let current = { x: 25, y: 25 }; // Start at the top-left corner
    
    rewards.forEach(reward => {
      createRandomPath(current, reward);
      current = reward;
    });
  
    // Place rewards on the maze
    rewards.forEach(reward => maze[reward.y][reward.x] = 2);
    maze[halfSize][halfSize] = 3;
    return maze;
}

const mazeSize = 50;
const halfSize = mazeSize / 2;
const numRewards = 18;
const exclusionZoneSize = 5;
const maze = generateMazeWithRewards(mazeSize, numRewards, exclusionZoneSize);
const scale_size = 4;

createGroundGrid(maze, 50, scale_size);

var fixedObjects = [];
var movableObjects = [];

// Generate function
function placeObjectOnCenters(scene, maze, Constructor, list) {
    // Iterate 
    list.forEach(center => {
      const object = new Constructor(scene, (gltf) => {
        gltf.scene.position.set(scale_size * (center.x - halfSize), 0, scale_size * (center.y - halfSize)); 
        scene.add(gltf.scene);
      });
      while (!object.getLoadPromise()) {}
      fixedObjects.push(object);
    });
}

function findreward(maze) {
    const zones = [];
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
          if (maze[y][x] === 2) {
            zones.push({ x, y });
          }
        }
    }
    return zones;
}

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

function findFence_x(maze) {
    const middlePoints = [];

    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x] === 0) {
                // Check if left neighbor is 1
                if (x > 0 && (maze[y][x - 1] === 1 || maze[y][x - 1] === 3)) {
                    middlePoints.push({ x: (x - 0.65), y });
                }
                // Check if right neighbor is 1
                if (x < maze[y].length - 1 && (maze[y][x + 1] === 1  || maze[y][x + 1] === 3)) {
                    middlePoints.push({ x: (x + 0.35), y });
                }
            }
        }
    }
    return middlePoints;
}

function findFence_y(maze) {
  const middlePoints = [];

  for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
          if (maze[y][x] === 0) {
              // Check if upper neighbor is 1
              if (y > 0 && (maze[y - 1][x] === 1 || maze[y - 1][x] === 3)) {
                  middlePoints.push({ x, y: (y - 0.7) });
              }
              // Check if lower neighbor is 1
              if (y < maze.length - 1 && (maze[y + 1][x] === 1 || maze[y + 1][x] === 3)) {
                  middlePoints.push({ x, y: (y + 0.3) });
              }
          }
      }
  }
  return middlePoints;
}

placeObjectOnCenters(scene, maze, Pumpkin, findreward(maze));
placeObjectOnCenters(scene, maze, Fence, findFence_y(maze));
placeObjectOnCenters(scene, maze, ReversedFence, findFence_x(maze));

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


const ghost = new Ghost(scene, (gltf) => {
    gltf.scene.position.set(0, 0, 0);
    scene.add(gltf.scene);
});
movableObjects.push(ghost);

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
    ghost.KeyDownHandler(event);
});

document.addEventListener('keyup', (event) => {
    ghost.KeyUpHandler(event);
});

function animate() {
    for (let i = 0; i < fixedObjects.length; i++) {
        fixedObjects[i].updateBoundary();
    }
    requestAnimationFrame(animate);

    if (ghost.object3D) { 
        ghost.animate(scene, fixedObjects);

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
    renderer.render(scene, camera);
}

let loadPromises =fixedObjects.map(object => {
    let loadPromise = object.getLoadPromise();
    return loadPromise;
});

Promise.all(loadPromises).then(() => {
    animate(); 
}).catch(error => {
    console.log(loadPromises);
    console.error("An error occurred while loading objects:", error);
});