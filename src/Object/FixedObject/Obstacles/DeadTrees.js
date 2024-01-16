import { Obstacles } from './Obstacles.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class DeadTrees extends Obstacles {
    constructor(scene, onLoadCallback) {
        super();
        this.promise = new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load('Models/Trees.glb', (gltf) => {
                //this.initialize(gltf, scene, onLoadCallback, 30, 35, 30);
                this.initialize(gltf, scene, onLoadCallback, 3, 3.5, 4);
                resolve(gltf);
            }, undefined, (error) => {
                reject(error);
            });
        });
    }
}
export default DeadTrees;