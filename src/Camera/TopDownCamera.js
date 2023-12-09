import { Group } from 'three';
import * as THREE from 'three';

export class TopDownCamera extends Group {
    constructor(fov, aspect, near, far, position) {
        super();
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.x = position.x;
        this.camera.position.y = 20;
        this.camera.position.z = position.z;
        this.camera.lookAt(position.x, 0, position.z); 
    }

    animate(position) {
        this.camera.position.set(position.x, 20, position.z);
        this.camera.lookAt(position.x, 0, position.z); 
    }
}

export default TopDownCamera;