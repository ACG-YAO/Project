import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'; // Importing PointerLockControls for mouse view control



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let cameraOffset = new THREE.Vector3(0, 2, 5);

let controls = new PointerLockControls(camera, renderer.domElement); // Create the controls
scene.add(controls.getObject());

function createGroundGrid(size, spacing) {
    const halfSize = size / 2;

    for (let i = -halfSize; i <= halfSize; i++) {
        for (let j = -halfSize; j <= halfSize; j++) {
            const geometry = new THREE.PlaneGeometry(spacing, spacing);
            const color = new THREE.Color(Math.random(), Math.random(), Math.random());
            const material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(i * spacing, 0, j * spacing);
            mesh.rotateX(Math.PI / 2);  // Rotate the plane to be horizontal
            scene.add(mesh);
        }
    }
}

// Create a 20x20 grid with each square being 1 unit in size
createGroundGrid(20, 1);

let pumpkin; 
const speed = 0.02; // Movement speed
let moveForward = false;
let moveBackward = false;
let turnLeft = false;
let turnRight = false;

const loader = new GLTFLoader();
loader.load('./models/Pumpkin.glb', (gltf) => {
    pumpkin = gltf.scene;
    pumpkin.scale.set(2, 2, 2);
    pumpkin.rotation.y = Math.PI;
    scene.add(pumpkin);
});

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

// Keyboard controls
document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyW':
            moveForward = true;
            break;
        case 'KeyS':
            moveBackward = true;
            break;
        case 'KeyA':
            turnLeft = true;
            break;
        case 'KeyD':
            turnRight = true;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyW':
            moveForward = false;
            break;
        case 'KeyS':
            moveBackward = false;
            break;
        case 'KeyA':
            turnLeft = false;
            break;
        case 'KeyD':
            turnRight = false;
            break;
    }
});

function animate() {
    requestAnimationFrame(animate);

    if (pumpkin) {
        // Determine the pumpkin's forward direction based on its rotation
        const direction = new THREE.Vector3();
        pumpkin.getWorldDirection(direction);

        if (moveForward) {
            pumpkin.position.add(direction.multiplyScalar(speed));  // Moving in the direction
        }
        if (moveBackward) {
            pumpkin.position.add(direction.multiplyScalar(-speed));   // Moving opposite to the direction
        }
        if (turnLeft) pumpkin.rotation.y += 0.5*speed;
        if (turnRight) pumpkin.rotation.y -= 0.5*speed;

        // Compute the relative camera offset based on the pumpkin's rotation
        const relativeOffsetX = cameraOffset.z * Math.sin(pumpkin.rotation.y) + cameraOffset.x * Math.cos(pumpkin.rotation.y);
        const relativeOffsetZ = cameraOffset.z * Math.cos(pumpkin.rotation.y) - cameraOffset.x * Math.sin(pumpkin.rotation.y);

        // Set the camera's position based on the pumpkin's position and the relative offset
        camera.position.set(
            pumpkin.position.x - relativeOffsetX,
            pumpkin.position.y + cameraOffset.y,
            pumpkin.position.z - relativeOffsetZ
        );

        // Make the camera look at the pumpkin
        camera.lookAt(pumpkin.position);
    }

    renderer.render(scene, camera);
}

animate();
