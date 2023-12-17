import { FixedObject } from '../FixedObject.js';

export class Reward extends FixedObject {
    constructor() {
        super();
        this.reward = true;
    }

    disappear() {
        this.reward = false;
        this.object3D.visible = false;
    }
}
export default Reward;