import { Group } from 'three';
import * as THREE from 'three';
import { FirstPersonPerspectiveCamera } from './FirstPersonPerspectiveCamera.js';
import { ThirdPersonPerspectiveCamera } from './ThirdPersonPerspectiveCamera.js';
import { TopDownCamera } from './TopDownCamera.js';

export class SwitchableCamera extends Group {
    constructor(fov, aspect, near, far, offset, position) {
        super();
        this.firstPersonPerspectiveCamera = new FirstPersonPerspectiveCamera(fov, aspect, near, far);
        this.thirdPersonPerspectiveCamera = new ThirdPersonPerspectiveCamera(fov, aspect, near, far, offset, position);
        this.topDownCamera = new TopDownCamera(fov, aspect, near, far, position);
        this.is_first = false;
        this.is_map = false;
        this.control_map = 'KeyM';
        this.control_view = 'KeyR';
    }
    
    resetController(map, changeview) {
        this.control_map = map;
        this.control_view = changeview;
    }

    getCamera() {
        if (this.is_map)
            return this.topDownCamera.camera;
        else if (this.is_first)
            return this.firstPersonPerspectiveCamera.camera;
        else
            return this.thirdPersonPerspectiveCamera.camera;
    }

    animate(position, rotation) {
        if (this.is_first)
            this.firstPersonPerspectiveCamera.animate(position, rotation);
        else
            this.thirdPersonPerspectiveCamera.animate(position, rotation);
        this.topDownCamera.animate(position);
        if (!this.is_map && this.is_first)
            this.getCamera().layers.set(0);
        else
            this.getCamera().layers.enableAll();
    }

    MouseDownHandler(event) {
        if (!this.is_first)
            this.thirdPersonPerspectiveCamera.MouseDownHandler(event);
    }

    MouseUpHandler(event) {
        if (!this.is_first)
            this.thirdPersonPerspectiveCamera.MouseUpHandler(event);
    }

    MouseMoveHandler(event) {
        if (!this.is_first)
            this.thirdPersonPerspectiveCamera.MouseMoveHandler(event);
    }

    KeyDownHandler(event) {
        if (event.code === this.control_view)
            this.is_first = !this.is_first;
        if (event.code === this.control_map)
            this.is_map = true;
    }

    KeyUpHandler(event) {
        if (event.code === this.control_map)
            this.is_map = false;
    }
}

export default SwitchableCamera;