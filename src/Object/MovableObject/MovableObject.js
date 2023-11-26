import { BaseObject } from '../BaseObject.js';
import * as THREE from 'three';

export class MovableObject extends BaseObject {
    constructor() {
        super();
        this.move_speed = 0;
        this.rotate_speed = 0;
        this.moveForward = false;
        this.moveBackward = false;
        this.turnLeft = false;
        this.turnRight = false;
        this.boundingBoxHelper = null;
    }

    check(scene) {
        // Initialize the bounding box helper
        this.boundingBoxHelper = new THREE.Box3Helper(new THREE.Box3(), 0xff0000);
        console.log(scene);
        scene.add(this.boundingBoxHelper);
    }

    animate(scene, objectsList) {
        // Check for collision before updating position
        if (this.boundingBoxHelper === null)
            this.check(scene);
        const collisionDetected = this.checkCollision(objectsList);
        console.log(collisionDetected);

        if (true) {
            const direction = new THREE.Vector3();
            this.object3D.getWorldDirection(direction);

            if (this.moveForward) {
                this.object3D.position.add(direction.multiplyScalar(this.move_speed));  // Moving in the direction
            }
            if (this.moveBackward) {
                this.object3D.position.add(direction.multiplyScalar(-this.move_speed));  // Moving opposite to the direction
            }
            if (this.turnLeft) this.object3D.rotation.y += this.rotate_speed;
            if (this.turnRight) this.object3D.rotation.y -= this.rotate_speed;
        }
        this.updateBoundingBoxHelper();
    }

    updateBoundingBoxHelper() {
        const halfSize = 0.5;
        const min = this.object3D.position.clone().sub(new THREE.Vector3(halfSize, 0, halfSize));
        const max = this.object3D.position.clone().add(new THREE.Vector3(halfSize, 2*halfSize, halfSize));
        this.boundingBoxHelper.box.set(min, max);
    }

    checkCollision(objectsList) {
        // Update the bounding box of the movable object
        const halfSize = 0.5;
        const min = this.object3D.position.clone().sub(new THREE.Vector3(halfSize, 0, halfSize));
        const max = this.object3D.position.clone().add(new THREE.Vector3(halfSize, 2 * halfSize, halfSize));
        const boundingBox = new THREE.Box3(min, max);

        let collisionDetected = false;

        // Iterate over the passed list of objects
        objectsList.forEach((object) => {
            const objectBoundingBox = new THREE.Box3().setFromObject(object.object3D);
            if (boundingBox.intersectsBox(objectBoundingBox)) {
                collisionDetected = true;
            }
        });

        return collisionDetected;
    }

}

export default MovableObject;
