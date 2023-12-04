import { Group } from 'three';
import * as THREE from 'three';

export class BaseMap extends Group {
    constructor(mazeSize, numRewards, exclusionZoneSize, scaleSize) {
        super();
        this.mazeSize = mazeSize;
        this.halfSize = mazeSize / 2;
        this.maze = Array.from({ length: mazeSize }, () => Array(mazeSize).fill(0));
        this.numRewards = numRewards;
        this.exclusionZoneSize = exclusionZoneSize;
        this.scaleSize = scaleSize;
        this.scene = new THREE.Scene();
        this.fixedObjectsList = [];
        this.movableObjectsList = [];
        this.Protagonist = null;
        this.Fence = null;
        this.ReversedFence = null;
        this.Reward = null;
    }

    setProtagonist(type) {
        this.Protagonist = type;
    }

    setFence(type) {
        this.Fence = type;
    }

    setReversedFence(type) {
        this.ReversedFence = type;
    }

    setReward(type) {
        this.Reward = type;
    }

    pushFixedObjects(object) {
        this.fixedObjectsList.push(object);
    }

    pushMovableObjects(object) {
        this.movableObjectsList.push(object);
    }

    getFixedObjects() {
        return this.fixedObjectsList;
    }

    getMovableObjects() {
        return this.movableObjectsList;
    }
}

export default BaseMap;