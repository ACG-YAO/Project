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


/*function createGroundGrid(size, spacing) {
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
*/

function createGroundGrid(maze, size, spacing) {
    const halfSize = size / 2;

    for (let i = -halfSize; i < halfSize; i++) {
        for (let j = -halfSize; j < halfSize; j++) {
            const geometry = new THREE.PlaneGeometry(spacing, spacing);
            let color;
            switch(maze[j + halfSize][i + halfSize]) {
              case 0: 
                color = new THREE.Color('gray');
                break;
              case 1: 
                color = new THREE.Color('white');
                break;
              case 2: 
                color = new THREE.Color('gold');
                break;
              case 3:
                color = new THREE.Color('red');
            }

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
    maze[25][25] = 3;
    return maze;
}

const mazeSize = 50;
const halfSize = mazeSize / 2;
const numRewards = 18;
const exclusionZoneSize = 15;
const maze = generateMazeWithRewards(mazeSize, numRewards, exclusionZoneSize);

console.log(maze);

createGroundGrid(maze, 50, 1);

var fixedObjects = [];
var movableObjects = [];


for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === 2) {
        // Create a new reward and place it at the (x, y) position
        const reward = new Pumpkin(scene, (gltf) => {
          gltf.scene.position.set(x - halfSize, 0, y - halfSize); // Set to the correct height if needed
          scene.add(gltf.scene);
        });
          // Assuming fixedObjects is an array to keep track of rewards
          while (!reward.getLoadPromise()) {

          }
          console.log(reward.getLoadPromise());
         fixedObjects.push(reward);
      }
    }
}

const ghost = new Ghost(scene, (gltf) => {
    gltf.scene.position.set(0, 0, 0);
    scene.add(gltf.scene);
});
movableObjects.push(ghost);


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
    console.log("Load Promise:", loadPromise);
    return loadPromise;
});

Promise.all(loadPromises).then(() => {
    animate(); 
}).catch(error => {
    console.error("An error occurred while loading objects:", error);
});