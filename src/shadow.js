/**
 * Shadow material.
 */

import {
    ShaderLib, ShaderMaterial, UniformsUtils
} from 'three';
import CasterVertex from './caster.vertex.glsl';

function createShadowCastingMaterial(
    isShadow, lightPosition
)
{
    let customUniforms = UniformsUtils.merge([
        ShaderLib.lambert.uniforms,
        {
            lightPosition: { value: lightPosition },
            isShadow: { value: isShadow },
            bias: { value: -0.1 },
        }
    ]);

    let material = new ShaderMaterial({
        uniforms: customUniforms,
        vertexShader: `
                #include <common>
                ${CasterVertex}
            `,
        fragmentShader:
        // `
        // #include <common>
        // ${CasterFragment}
        // `,
        ShaderLib.lambert.fragmentShader,
        lights: true
    });

    return material;
}

export { createShadowCastingMaterial };
