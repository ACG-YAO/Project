import { Obstacles } from './Obstacles.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
export class ReversedShibaInu extends Obstacles {
    constructor(scene, onLoadCallback) {
        super();
        this.mixer = null;
        this.clock = new THREE.Clock();
        this.move_speed = 0.06;
        this.rotate_speed = 0.015;
        this.promise = new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load('Models/ShibaInu.glb', (gltf) => {
                this.initialize(gltf, scene, onLoadCallback, 0.38, 0.38, 0.38);
                gltf.scene.rotation.y = Math.PI / 2; 
                this.mixer = new THREE.AnimationMixer(gltf.scene);
                this.actions = [];
                gltf.animations.forEach((clip, index) => {
                    const action = this.mixer.clipAction(clip);
                    this.actions.push(action);
                    if (index === 2) {
                        action.play();
                    }
                });
                this.switchAnimation = function(index) {
                    if (index >= 0 && index < this.actions.length) {
                        this.actions.forEach((action) => action.stop());
                        this.actions[index].play();
                    } else {
                        console.warn('Animation index out of bounds');
                    }
                };
                 resolve(gltf);
             }, undefined, (error) => {
                 reject(error);
             });
        });
    }

    animate() {
        if (this.mixer) {
            const delta = this.clock.getDelta();
            this.mixer.update(delta);
        }
        return true;
    }
}
export default ReversedShibaInu;