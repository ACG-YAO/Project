import { MovableObject } from '../MovableObject.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
export class Protagonist extends MovableObject {
    constructor(){
        super();
        this.mixer = null;
        this.clock = new THREE.Clock();
    }

    KeyDownHandler(event) {
        switch (event.code) {
        case 'KeyW':
            this.moveForward = true;
            break;
        case 'KeyS':
            this.moveBackward = true;
            break;
        case 'KeyA':
            this.turnLeft = true;
            break;
        case 'KeyD':
            this.turnRight = true;
            break;
        }   
     }

    KeyUpHandler(event) {
        switch (event.code) {
        case 'KeyW':
            this.moveForward = false;
            break;
        case 'KeyS':
            this.moveBackward = false;
            break;
        case 'KeyA':
            this.turnLeft = false;
            break;
        case 'KeyD':
            this.turnRight = false;
            break;
            }
    }

    animate(scene, objectsList) {
        if (this.boundingBoxHelper === null)
            this.check(scene);
        this.checkCollision(scene, objectsList);
        this.handleMovement(objectsList);
        this.updateBoundingBoxHelper();
        if (this.mixer) {
            const delta = this.clock.getDelta();
            this.mixer.update(delta);
        }
    }

}
export default Protagonist;