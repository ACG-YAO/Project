import { FixedObject } from '../FixedObject.js';

export class Reward extends FixedObject {
    constructor() {
        super();
        this.disappear = false;
    }

    disappear() {
        this.disappear = true;
    }
}
export default Reward;