import { Obstacles } from './Obstacles.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Campfire extends Obstacles {
    constructor(scene, onLoadCallback) {
        super();
        this.promise = new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load('Models/Campfire.glb', (gltf) => {
                this.initialize(gltf, scene, onLoadCallback, 0.8, 0.8, 0.8);
                resolve(gltf);
            }, undefined, (error) => {
                reject(error);
            });
        });
    }
}
export default Campfire;