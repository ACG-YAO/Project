import { FixedObject } from '../FixedObject.js';

export class Reward extends FixedObject {

    static score = 0;
    constructor() {
        super();
        this.reward = true;
    }

    disappear() {
        this.reward = false;
        Reward.score++;
    }
}
export default Reward;