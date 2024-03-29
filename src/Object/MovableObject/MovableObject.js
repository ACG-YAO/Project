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
        this.boundingBoxHelper = new THREE.Box3Helper(new THREE.Box3(), 0xff0000);
        //scene.add(this.boundingBoxHelper);
    }

    animate(scene, objectsList) {
        if (this.boundingBoxHelper === null)
            this.check(scene);
        let rewardDetected = this.checkCollision(scene, objectsList);
        this.handleMovement(objectsList);
        this.updateBoundingBoxHelper();
        return rewardDetected;
    }

    handleMovement(objectsList) {
        const direction = new THREE.Vector3();
        this.object3D.getWorldDirection(direction);
        let potentialPosition = this.object3D.position.clone();
        if (this.moveForward) {
            potentialPosition.add(direction.clone().multiplyScalar(this.move_speed));
        }
        if (this.moveBackward) {
            potentialPosition.sub(direction.clone().multiplyScalar(this.move_speed));
        }
        
        let potentialRotation = this.object3D.rotation.clone();
        if (this.turnLeft) potentialRotation.y += this.rotate_speed;
        if (this.turnRight) potentialRotation.y -= this.rotate_speed;

        let bag = this.willCollide(potentialPosition, potentialRotation, objectsList);
        let collisionDetected = bag['collisionDetected'];
        let walls = bag['walls'];
        if (!collisionDetected) { 
            this.object3D.position.copy(potentialPosition);
            this.object3D.rotation.copy(potentialRotation);
        }else{
            let finalVelocity = direction.clone();
            walls.forEach((wall) => {
                let wallNormal = this.calculateWallNormal(wall, this.object3D.position);
                let dotProduct = finalVelocity.dot(wallNormal);
                let normalComponent = wallNormal.multiplyScalar(dotProduct);
                let tangentComponent = finalVelocity.clone().sub(normalComponent);
                finalVelocity= tangentComponent;
            });
            
            finalVelocity.multiplyScalar(this.move_speed);
            if (this.moveForward) {
                this.object3D.position.add(finalVelocity);
            }
            if (this.moveBackward) {
                this.object3D.position.sub(finalVelocity);
            }
            this.object3D.rotation.copy(potentialRotation);
        }
    }

    calculateWallNormal(wall, agentPosition) {
        let wallBoundingBox = new THREE.Box3().setFromObject(wall.object3D);
        let size = new THREE.Vector3();
        wallBoundingBox.getSize(size);
        let wallNormal = new THREE.Vector3();
        if (size.x > size.y) {
            if (agentPosition.y > wallBoundingBox.min.y) {
                wallNormal.set(0, 0, 1);
            } else {
                wallNormal.set(0, 0, -1);
            }
        } else {
            if (agentPosition.x > wallBoundingBox.min.x) {
                wallNormal.set(1, 0, 0);
            } else {
                wallNormal.set(-1, 0, 0);
            }
        }
        return wallNormal;
    }

    updateBoundingBoxHelper() {
        const halfSize = 0.5;
        const min = this.object3D.position.clone().sub(new THREE.Vector3(halfSize, 0, halfSize));
        const max = this.object3D.position.clone().add(new THREE.Vector3(halfSize, 2*halfSize, halfSize));
        this.boundingBoxHelper.box.set(min, max);
    }

    checkCollision(scene, objectsList) {
        const halfSize = 0.6;
        const min = this.object3D.position.clone().sub(new THREE.Vector3(halfSize, 0, halfSize));
        const max = this.object3D.position.clone().add(new THREE.Vector3(halfSize, 2 * halfSize, halfSize));
        const boundingBox = new THREE.Box3(min, max);

        let rewardDetected = false;
        objectsList.forEach((object) => {
            const objectBoundingBox = new THREE.Box3().setFromObject(object.object3D);
            if (boundingBox.intersectsBox(objectBoundingBox)) {
                if (object.reward) {
                    object.disappear();
                    rewardDetected = true;
                }
            }
        });
        return rewardDetected;
    }

    willCollide(potentialPosition, potentialRotation, objectsList) {
        let testObject = this.object3D.clone();
        testObject.position.copy(potentialPosition);
        testObject.rotation.copy(potentialRotation);
        const halfSize = 0.6;
        const min = testObject.position.clone().sub(new THREE.Vector3(halfSize, 0, halfSize));
        const max = testObject.position.clone().add(new THREE.Vector3(halfSize, 2 * halfSize, halfSize));
        const boundingBox = new THREE.Box3(min, max);
        let collisionDetected = false;
        let walls = new Array();
        objectsList.forEach((object) => {
            const objectBoundingBox = new THREE.Box3().setFromObject(object.object3D);
            if (boundingBox.intersectsBox(objectBoundingBox)) {
                if (object.obstacle) {
                    collisionDetected = true;
                    walls.push(object);
                }
            }
        });
        return { collisionDetected, walls };
    }
}

export default MovableObject;
