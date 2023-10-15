import { Group } from 'three';

export class BaseObject extends Group {
    constructor() {
        super();
        this.object3D = null; // This will store the Three.js object once it's loaded
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
}

export default BaseObject;