import { Obstacles } from './Obstacles.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Fence_reverse extends Obstacles {
    constructor(scene, onLoadCallback) {
        super();
        this.promise = new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load('Models/Fence.glb', (gltf) => {
                this.initialize(gltf, scene, onLoadCallback, 8, 3, 2);
                
                // Rotate the model by 90 degrees around the Y axis
                gltf.scene.rotation.y = Math.PI / 2; // Math.PI / 2 is 90 degrees in radians

                resolve(gltf);
            }, undefined, (error) => {
                reject(error);
            });
        });
    }
}
export default Fence_reverse;
