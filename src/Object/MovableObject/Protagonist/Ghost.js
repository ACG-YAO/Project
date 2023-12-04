import { Protagonist } from './Protagonist.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Ghost extends Protagonist {
    constructor(scene, onLoadCallback) {
        super();
        this.move_speed = 0.05;
        this.rotate_speed = 0.01;
        this.promise = new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load('Models/Enemy1.glb', (gltf) => {
                this.initialize(gltf, scene, onLoadCallback, 0.5, 0.5, 0.5);
                resolve(gltf);
            }, undefined, (error) => {
                reject(error);
            });
        });
    } 
}
export default Ghost;