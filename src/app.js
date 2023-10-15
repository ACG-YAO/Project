import * as THREE from 'three';
import { Ghost  } from './Object';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'; // Importing PointerLockControls for mouse view control



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let cameraOffset = new THREE.Vector3(0, 2, 5);
renderer.setClearColor(0x00BFFF); // RGB value for blue

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


const speed = 0.02; // Movement speed
let moveForward = false;
let moveBackward = false;
let turnLeft = false;
let turnRight = false;

const pumpkin = new Ghost((gltf) => {
    scene.add(gltf.scene);
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
    pumpkin.KeyDownHandler(event);
});

document.addEventListener('keyup', (event) => {
    pumpkin.KeyUpHandler(event);
});

function animate() {
    requestAnimationFrame(animate);

    if (pumpkin.object3D) {
        pumpkin.animate();

        // Compute the relative camera offset based on the pumpkin.object3D's rotation
        const relativeOffsetX = cameraOffset.z * Math.sin(pumpkin.object3D.rotation.y) + cameraOffset.x * Math.cos(pumpkin.object3D.rotation.y);
        const relativeOffsetZ = cameraOffset.z * Math.cos(pumpkin.object3D.rotation.y) - cameraOffset.x * Math.sin(pumpkin.object3D.rotation.y);

        // Set the camera's position based on the pumpkin.object3D's position and the relative offset
        camera.position.set(
            pumpkin.object3D.position.x - relativeOffsetX,
            pumpkin.object3D.position.y + cameraOffset.y,
            pumpkin.object3D.position.z - relativeOffsetZ
        );

        // Make the camera look at the pumpkin.object3D
        camera.lookAt(pumpkin.object3D.position);
    }

    renderer.render(scene, camera);
}

animate();
