import { Group } from 'three';
import * as THREE from 'three';

export class BaseObject extends Group {
    constructor() {
        super();
        this.object3D = null; // This will store the Three.js object once it's loaded
        this.BoundingBox = null;
        //this.boxHelper = null;
    }

    initialize(gltf, scene, onLoadCallback, x, y, z) {
        this.object3D = gltf.scene;
        this.object3D.scale.set(x, y, z);
        this.BoundingBox = new THREE.Box3().setFromObject(this.object3D);
        //this.boxHelper = new THREE.BoxHelper(this.object3D, 0xff0000);
        //scene.add(this.boxHelper);
        if (onLoadCallback) onLoadCallback(gltf); // call the callback if provided
    }

    updateBoundary() {
        //this.boxHelper.update();
    }

    // Function to check collision with another object
    collision(otherObject) {
        if (!this.object3D || !otherObject.object3D) return false;

        // Compute the bounding boxes for both objects if they don't exist
        if (!this.object3D.boundingBox) {
            this.object3D.geometry.computeBoundingBox();
            this.object3D.boundingBox = this.object3D.geometry.boundingBox.clone();
        }
        if (!otherObject.object3D.boundingBox) {
            otherObject.object3D.geometry.computeBoundingBox();
            otherObject.object3D.boundingBox = otherObject.object3D.geometry.boundingBox.clone();
        }

        // Update the bounding boxes to account for object transformations
        const box1 = this.object3D.boundingBox.clone().applyMatrix4(this.object3D.matrixWorld);
        const box2 = otherObject.object3D.boundingBox.clone().applyMatrix4(otherObject.object3D.matrixWorld);

        return box1.intersectsBox(box2);
    }

    getLoadPromise() {
        return this.promise;
    }
}

export default BaseObject;