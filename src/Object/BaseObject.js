import { Group } from 'three';
import * as THREE from 'three';

export class BaseObject extends Group {
    constructor() {
        super();
        this.object3D = null; // This will store the Three.js object once it's loaded
        this.BoundingBox = null;
        this.boxHelper = null;
    }

    initialize(gltf, scene, onLoadCallback, x, y, z) {
        this.object3D = gltf.scene;
        this.object3D.scale.set(x, y, z);
        this.BoundingBox = new THREE.Box3().setFromObject(this.object3D);
        this.boxHelper = new THREE.BoxHelper(this.object3D, 0xff0000);
        //scene.add(this.boxHelper);
        if (onLoadCallback) onLoadCallback(gltf); // call the callback if provided
    }

    updateBoundary() {
        this.boxHelper.update();
    }

    getLoadPromise() {
        return this.promise;
    }
}

export default BaseObject;