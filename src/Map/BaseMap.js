import { Group } from 'three';
import * as THREE from 'three';

export class BaseMap extends Group {
    constructor() {
        super();
        this.scene = null;
        this.fixedObjectsList = [];
        this.movableObjectsList = [];
    }

    getFixedObjects() {

    }

    getMovableObjects() {

    }
}

export default BaseMap;