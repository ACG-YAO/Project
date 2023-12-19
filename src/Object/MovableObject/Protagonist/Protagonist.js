import { MovableObject } from '../MovableObject.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
export class Protagonist extends MovableObject {
    constructor(){
        super();
        this.mixer = null;
        this.clock = new THREE.Clock();
        this.control_forward = 'KeyW';
        this.control_backward = 'KeyS';
        this.control_left = 'KeyA';
        this.control_right = 'KeyD';
    }

    resetController(control_forward, control_backward, control_left, control_right) {
        this.control_forward = control_forward;
        this.control_backward = control_backward;
        this.control_left = control_left;
        this.control_right = control_right;
    }

    KeyDownHandler(event) {
        switch (event.code) {
        case this.control_forward:
            this.moveForward = true;
            break;
        case this.control_backward:
            this.moveBackward = true;
            break;
        case this.control_left:
            this.turnLeft = true;
            break;
        case this.control_right:
            this.turnRight = true;
            break;
        }   
     }

    KeyUpHandler(event) {
        switch (event.code) {
        case this.control_forward:
            this.moveForward = false;
            break;
        case this.control_backward:
            this.moveBackward = false;
            break;
        case this.control_left:
            this.turnLeft = false;
            break;
        case this.control_right:
            this.turnRight = false;
            break;
            }
    }

    animate(scene, objectsList) {
        if (this.boundingBoxHelper === null)
            this.check(scene);
        let rewardDetected = this.checkCollision(scene, objectsList);
        this.handleMovement(objectsList);
        this.updateBoundingBoxHelper();
        if (this.mixer) {
            const delta = this.clock.getDelta();
            this.mixer.update(delta);
        }
        return rewardDetected;
    }

}
export default Protagonist;