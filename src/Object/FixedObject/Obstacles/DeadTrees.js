import { Obstacles } from './Obstacles.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class DeadTrees extends Obstacles {
    constructor(scene, onLoadCallback) {
        super();
        this.promise = new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load('Models/DeadTrees.glb', (gltf) => {
                this.initialize(gltf, scene, onLoadCallback, 30, 35, 30);
                resolve(gltf);
            }, undefined, (error) => {
                reject(error);
            });
        });
    }
}
export default DeadTrees;