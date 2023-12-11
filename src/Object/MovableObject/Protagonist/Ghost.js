import { Protagonist } from './Protagonist.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
export class Ghost extends Protagonist {
    constructor(scene, onLoadCallback) {
        super();
        this.move_speed = 0.06;
        this.rotate_speed = 0.015;
        this.promise = new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load('Models/Enemy1.glb', (gltf) => {
                this.initialize(gltf, scene, onLoadCallback, 0.5, 0.5, 0.5);
                this.setupLayers(gltf);
                this.mixer = new THREE.AnimationMixer(gltf.scene);
                gltf.animations.forEach((clip) => {
                    this.mixer.clipAction(clip).play();
                });
                 resolve(gltf);
             }, undefined, (error) => {
                 reject(error);
             });
        });
    }

    setupLayers(gltf) {
        
        const preserveLayers = new Set(['Ghost_Skull_1']);
        const preservedObjects = new Set();
        
        gltf.scene.traverse((child) => {
            if (preserveLayers.has(child.name)) {
                preservedObjects.add(child);
                child.traverse((descendant) => {
                    preservedObjects.add(descendant);
                });
            }
        });
        gltf.scene.traverse((child) => {
            if (!preservedObjects.has(child)) {
                child.layers.set(1);
            }
        });
    }

}

export default Ghost;