/**
 * Shadow material.
 */

import {
    ShaderLib, ShaderMaterial, UniformsUtils
} from 'three';
import CasterVertex from './caster.vertex.glsl';

function createShadowCastingMaterial(
    isShadow, lightPosition, bias
)
{
    let customUniforms = UniformsUtils.merge([
        ShaderLib.lambert.uniforms,
        {
            lightPosition: { value: lightPosition },
            isShadow: { value: isShadow },
            bias: { value: bias },
        }
    ]);

    return new ShaderMaterial({
        uniforms: customUniforms,
        vertexShader: `
                #include <common>
                ${CasterVertex}
            `,
        fragmentShader:
            ShaderLib.lambert.fragmentShader,
        lights: true
    });
}

export { createShadowCastingMaterial };
