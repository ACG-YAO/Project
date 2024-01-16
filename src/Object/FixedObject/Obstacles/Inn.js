import { Obstacles } from './Obstacles.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Inn extends Obstacles {
    constructor(scene, onLoadCallback) {
        super();
        this.promise = new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load('Models/Inn1.glb', (gltf) => {
                //this.initialize(gltf, scene, onLoadCallback, 1.4, 1.0, 1.4);
                this.initialize(gltf, scene, onLoadCallback, 3.5, 3.5, 3);
                gltf.scene.position.y += 1.9;
                resolve(gltf);
            }, undefined, (error) => {
                reject(error);
            });
        });
    }
}
export default Inn;