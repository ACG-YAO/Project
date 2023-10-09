import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; // Make sure the path is correct

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(hemiLight);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let pumpkin; // This will store our pumpkin model

// Load the pumpkin model
const loader = new GLTFLoader();
loader.load('./models/Pumpkin.glb', (gltf) => {
    pumpkin = gltf.scene; // The loaded model's scene
    scene.add(pumpkin);
});

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1).normalize();
scene.add(light);

camera.position.z = 5;

renderer.setSize(window.innerWidth, window.innerHeight);
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
renderer.setPixelRatio(window.devicePixelRatio);


function animate() {
    requestAnimationFrame(animate);

    if (pumpkin) { // Check if pumpkin is loaded before trying to animate it
        pumpkin.rotation.x += 0.01;
        pumpkin.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
}

animate();
