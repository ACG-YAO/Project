import { Obstacles } from './Obstacles.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class ReversedFence extends Obstacles {
    constructor(scene, onLoadCallback) {
        super();
        this.promise = new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load('Models/Fence.glb', (gltf) => {
                this.initialize(gltf, scene, onLoadCallback, 8, 3, 2);
                gltf.scene.rotation.y = Math.PI / 2; 
                resolve(gltf);
            }, undefined, (error) => {
                reject(error);
            });
        });
    }
}
export default ReversedFence;
