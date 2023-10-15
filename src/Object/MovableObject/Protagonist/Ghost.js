import { Protagonist } from './Protagonist.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Ghost extends Protagonist {
    constructor(onLoadCallback) {
        super();
        this.move_speed = 0.02;
        this.rotate_speed = 0.01;
        const loader = new GLTFLoader();
        loader.load('Models/Enemy1.glb', (gltf) => {
            this.object3D = gltf.scene;
            this.object3D.scale.set(0.5, 0.5, 0.5);
            if (onLoadCallback) onLoadCallback(gltf); // call the callback if provided
        });
    } 
}
export default Ghost;