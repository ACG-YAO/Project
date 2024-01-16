import { Protagonist } from './Protagonist.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
export class Ghost extends Protagonist {
    constructor(scene, onLoadCallback) {
        super();
        this.move_speed = 0.12;
        this.rotate_speed = 0.03;
        this.promise = new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load('Models/Enemy1.glb', (gltf) => {
                this.initialize(gltf, scene, onLoadCallback, 0.5, 0.5, 0.5);
                this.setupLayers(gltf);
                this.mixer = new THREE.AnimationMixer(gltf.scene);
                this.actions = [];
                gltf.animations.forEach((clip, index) => {
                    const action = this.mixer.clipAction(clip);
                    this.actions.push(action);
                    if (index === 2) {
                        action.play();
                    }
                });
                this.switchAnimation = function(index) {
                    if (index >= 0 && index < this.actions.length) {
                        this.actions.forEach((action) => action.stop());
                        this.actions[index].play();
                    } else {
                        console.warn('Animation index out of bounds');
                    }
                };
                 resolve(gltf);
             }, undefined, (error) => {
                 reject(error);
             });
        });
    }

    KeyDownHandler(event) {
        switch (event.code) {
        case this.control_forward:
            this.moveForward = true;
            this.actions[7].play();
            break;
        case this.control_backward:
            this.moveBackward = true;
            this.actions[7].play();
            break;
        case this.control_left:
            this.turnLeft = true;
            break;
        case this.control_right:
            this.turnRight = true;
            break;
        }   
     }

    KeyUpHandler(event) {
        switch (event.code) {
        case this.control_forward:
            this.moveForward = false;
            break;
        case this.control_backward:
            this.moveBackward = false;
            break;
        case this.control_left:
            this.turnLeft = false;
            break;
        case this.control_right:
            this.turnRight = false;
            break;
        }
        if (this.moveForward === false && this.moveBackward === false && this.turnLeft === false && this.turnRight === false) {
            this.actions.forEach((action) => action.stop());
            this.actions[2].play();
        }
    }

    animate(scene, objectsList) {
        if (this.boundingBoxHelper === null)
            this.check(scene);
        let rewardDetected = this.checkCollision(scene, objectsList);
        if (rewardDetected === true ){
            this.switchAnimation(3);
            setTimeout(() => {
                this.switchAnimation(2);
            }, 1000);
        }
        this.handleMovement(objectsList);
        this.updateBoundingBoxHelper();
        if (this.mixer) {
            const delta = this.clock.getDelta();
            this.mixer.update(delta);
        }
        return rewardDetected;
    }

    setupLayers(gltf) {
        
        const preserveLayers = new Set(['Ghost_Skull_1']);
        const preservedObjects = new Set();
        
        gltf.scene.traverse((child) => {
            if (preserveLayers.has(child.name)) {
                preservedObjects.add(child);
                child.traverse((descendant) => {
                    preservedObjects.add(descendant);
                });
            }
        });
        gltf.scene.traverse((child) => {
            if (!preservedObjects.has(child)) {
                child.layers.set(1);
            }
        });
    }

}

export default Ghost;