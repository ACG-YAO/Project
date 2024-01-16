import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { SavePass } from 'three/examples/jsm/postprocessing/SavePass.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';
import { BlendShader } from 'three/examples/jsm/shaders/BlendShader.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';

export class RenderComposer {

    constructor(renderer, scene, camera, mixRatio) {
        this.composer = new EffectComposer(renderer);
        this.renderPass = new RenderPass(scene, camera);

        this.renderTargetParameters = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            stencilBuffer: false
        };
        this.savePass = new SavePass(new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, this.renderTargetParameters));

        this.blendPass = new ShaderPass(BlendShader, "tDiffuse1");
        this.blendPass.uniforms["tDiffuse2"].value = this.savePass.renderTarget.texture;
        this.blendPass.uniforms["mixRatio"].value = mixRatio;
        this.smaaPass = new SMAAPass(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
        this.outputPass = new ShaderPass(CopyShader);
        this.outputPass.renderToScreen = true;

        this.composer.addPass(this.renderPass);
        this.composer.addPass(this.blendPass);
        this.composer.addPass(this.savePass);
        this.composer.addPass(this.smaaPass);
        this.composer.addPass(this.outputPass);
    }

    render() {
        this.composer.render();
    }

}


export default RenderComposer;