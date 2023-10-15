import { MovableObject } from '../MovableObject.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Protagonist extends MovableObject {
    constructor(){
        super();
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
}
export default Protagonist;