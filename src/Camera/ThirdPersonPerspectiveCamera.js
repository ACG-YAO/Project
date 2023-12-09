import { Group } from 'three';
import * as THREE from 'three';

export class ThirdPersonPerspectiveCamera extends Group {
    constructor(fov, aspect, near, far, offset, position) {
        super();
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.offset = offset;
        this.camera.position.x = position.x;
        this.camera.position.y = position.y;
        this.camera.position.z = position.z;
        this.angle = 0;
        this.isDragging = false;
    }

    animate(position, rotation) {
        if (!this.isDragging && Math.abs(this.angle) > 0.006) {
            if (this.angle > 0) this.angle -= 0.005;
            else this.angle += 0.005;
        }

        const relativeOffsetX = this.offset.z * Math.sin(rotation.y + this.angle) + this.offset.x * Math.cos(rotation.y + this.angle);
        const relativeOffsetZ = this.offset.z * Math.cos(rotation.y + this.angle) - this.offset.x * Math.sin(rotation.y + this.angle);

        this.camera.position.set(
            position.x - relativeOffsetX,
            position.y + this.offset.y,
            position.z - relativeOffsetZ
        );

        this.camera.lookAt(position);
    }

    MouseDownHandler(event) {
        this.isDragging = true;
    }

    MouseUpHandler(event) {
        this.isDragging = false;
    }

    MouseMoveHandler(event) {
        if (this.isDragging) {
            if (Math.abs(this.angle - event.movementX * 0.002) <= 30 * Math.PI / 180)
                this.angle -= event.movementX * 0.002;
        }
    }
}

export default ThirdPersonPerspectiveCamera;