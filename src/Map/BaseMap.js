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
        this.dogsList = [];
        this.allObjectsList = [];
        this.Protagonist = null;
        this.Fence = null;
        this.ReversedFence = null;
        this.Reward = null;
        this.Dog = null;
        this.ReversedDog = null;
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

    setDog(type) {
        this.Dog = type;
    }

    setReversedDog(type) {
        this.ReversedDog = type;
    }

    pushFixedObjects(object) {
        this.fixedObjectsList.push(object);
    }

    pushMovableObjects(object) {
        this.movableObjectsList.push(object);
    }

    pushDogs(object) {
        this.dogsList.push(object);
    }

    getFixedObjects() {
        return this.fixedObjectsList;
    }

    getMovableObjects() {
        return this.movableObjectsList;
    }

    getDogs() {
        return this.dogsList;
    }
}

export default BaseMap;