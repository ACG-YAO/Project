import { Reward } from './Reward.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Pumpkin extends Reward {
    constructor(scene, onLoadCallback) {
        super();
        this.rotate_speed = 0.02;
        this.turnRight = true;
        this.promise = new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load('Models/Pumpkin.glb', (gltf) => {
                this.initialize(gltf, scene, onLoadCallback, 3.0, 3.0, 3.0);
                resolve(gltf); 
            }, undefined, (error) => {
                reject(error); 
            });
        });
    }
}
export default Pumpkin;