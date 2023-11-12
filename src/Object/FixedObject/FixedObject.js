import { BaseObject } from '../BaseObject.js';

export class FixedObject extends BaseObject {
    constructor() {
        super();
        this.rotate_speed = 0;
        this.turnLeft = false;
        this.turnRight = false;
    }

    animate() {
        if (this.turnLeft) this.object3D.rotation.y += this.rotate_speed;
        if (this.turnRight) this.object3D.rotation.y -= this.rotate_speed;
    }
}
export default FixedObject;