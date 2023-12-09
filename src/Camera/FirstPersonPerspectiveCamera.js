import { Group } from 'three';
import * as THREE from 'three';
export class FirstPersonPerspectiveCamera extends Group {
    constructor(fov, aspect, near, far) {
        super();
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    }

    animate(position, rotation) {
        this.camera.position.set(position.x, position.y + 1, position.z);
        this.camera.rotation.set(rotation.x, rotation.y + Math.PI, rotation.z);
    }
}

export default FirstPersonPerspectiveCamera;
