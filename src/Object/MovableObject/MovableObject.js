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
    }

    animate(detection_list) {
       const direction = new THREE.Vector3();
       
        this.object3D.getWorldDirection(direction);
        if (this.moveForward) {
            this.object3D.position.add(direction.multiplyScalar(this.move_speed));  // Moving in the direction
        }
        if (this.moveBackward) {
            this.object3D.position.add(direction.multiplyScalar(-this.move_speed));   // Moving opposite to the direction
        }
        if (this.turnLeft) this.object3D.rotation.y += this.rotate_speed;
        if (this.turnRight) this.object3D.rotation.y -= this.rotate_speed;
    }
}
export default MovableObject;
