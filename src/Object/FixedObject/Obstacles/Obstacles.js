import { FixedObject } from '../FixedObject.js';

export class Obstacles extends FixedObject {
    constructor() {
        super();
        this.obstacle = true;
    }
}
export default Obstacles;