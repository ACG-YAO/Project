import { Obstacles } from './Obstacles.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();
const baseColorTexture = textureLoader.load('Textures/WoodFence_baseColor.png');
const metallicRoughnessTexture = textureLoader.load('Textures/WoodFence_metallicRoughness.png');
const normalTexture = textureLoader.load('Textures/WoodFence_normal.png');

export class ReversedFence extends Obstacles {
    constructor(scene, onLoadCallback) {
        super();
        this.promise = new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load('Models/Fence.gltf', (gltf) => {
                gltf.scene.traverse((child) => {
                    if (child.isMesh) {
                        child.material.map = baseColorTexture;
                        child.material.metalnessMap = metallicRoughnessTexture; 
                        child.material.roughnessMap = metallicRoughnessTexture;
                        child.material.normalMap = normalTexture;
                        child.material.needsUpdate = true;
                    }
                });
                
                this.initialize(gltf, scene, onLoadCallback, 2.67, 3, 1);
                gltf.scene.rotation.y = Math.PI / 2; 
                resolve(gltf);
            }, undefined, (error) => {
                reject(error);
            });
        });
    }
}
export default ReversedFence;
