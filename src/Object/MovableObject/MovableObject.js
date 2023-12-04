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
        this.history = [];
        this.historySize = 50;
    }

    updateHistory() {
        this.history.unshift({
            position: this.object3D.position.clone(),
            rotation: this.object3D.rotation.clone()
        });
        if (this.history.length > this.historySize) {
            this.history.pop();
        }
    }

    check(scene) {
        this.boundingBoxHelper = new THREE.Box3Helper(new THREE.Box3(), 0xff0000);
        console.log(scene);
        scene.add(this.boundingBoxHelper);
    }

    animate(scene, objectsList) {
        if (this.boundingBoxHelper === null)
            this.check(scene);
        const collisionDetected = this.checkCollision(scene, objectsList);
        console.log(collisionDetected);

        if (!collisionDetected) {
            this.handleMovement();
            this.updateHistory();
        } else {
            this.revertToPreviousState();
        }
        this.updateBoundingBoxHelper();
    }

    handleMovement() {
        const direction = new THREE.Vector3();
        this.object3D.getWorldDirection(direction);

        if (this.moveForward) {
            this.object3D.position.add(direction.multiplyScalar(this.move_speed));
        }
        if (this.moveBackward) {
            this.object3D.position.add(direction.multiplyScalar(-this.move_speed));
        }
        if (this.turnLeft) this.object3D.rotation.y += this.rotate_speed;
        if (this.turnRight) this.object3D.rotation.y -= this.rotate_speed;
    }

    revertToPreviousState() {
        if (this.history.length > 0) {
            const prevState = this.history.shift();
            this.object3D.position.copy(prevState.position);
            this.object3D.rotation.copy(prevState.rotation);
        }
    }

    updateBoundingBoxHelper() {
        const halfSize = 0.5;
        const min = this.object3D.position.clone().sub(new THREE.Vector3(halfSize, 0, halfSize));
        const max = this.object3D.position.clone().add(new THREE.Vector3(halfSize, 2*halfSize, halfSize));
        this.boundingBoxHelper.box.set(min, max);
    }

    checkCollision(scene, objectsList) {
        const halfSize = 0.5;
        const min = this.object3D.position.clone().sub(new THREE.Vector3(halfSize, 0, halfSize));
        const max = this.object3D.position.clone().add(new THREE.Vector3(halfSize, 2 * halfSize, halfSize));
        const boundingBox = new THREE.Box3(min, max);

        let collisionDetected = false;
        
        objectsList.forEach((object) => {
            const objectBoundingBox = new THREE.Box3().setFromObject(object.object3D);
            if (boundingBox.intersectsBox(objectBoundingBox)) {
                if (object.obstacle) {
                    collisionDetected = true;
                }
                else if (object.reward) {
                    object.disappear();
                    scene.remove(object.object3D);
                }
            }
        });

        return collisionDetected;
    }

}

export default MovableObject;
