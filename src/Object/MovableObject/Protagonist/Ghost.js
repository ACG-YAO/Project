import { Protagonist } from './Protagonist.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
export class Ghost extends Protagonist {
    constructor(scene, onLoadCallback) {
        super();
        this.move_speed = 0.05;
        this.rotate_speed = 0.01;
        this.promise = new Promise((resolve, reject) => {
            // const loader = new GLTFLoader();
            // loader.load('Models/Enemy1.glb', (gltf) => {
            //     this.initialize(gltf, scene, onLoadCallback, 0.5, 0.5, 0.5);
            //     resolve(gltf);
            // }, undefined, (error) => {
            //     reject(error);
            // });
            const loader = new GLTFLoader();
            loader.load('Models/Enemy1.glb', (gltf) => {
                //scene.add(gltf.scene);
                this.initialize(gltf, scene, onLoadCallback, 0.5, 0.5, 0.5);
                // Access the animations.
                const mixer = new THREE.AnimationMixer(gltf.scene);
                gltf.animations.forEach((clip) => {
                    mixer.clipAction(clip).play();
                });
  
                animate();
            });
        });
    } 
}

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  
  // Update the animation mixer on each frame.
  const delta = clock.getDelta();
  mixer.update(delta);
  
  renderer.render(scene, camera);
}
export default Ghost;