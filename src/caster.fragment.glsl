
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
varying vec3 vLightFront;
varying vec3 vIndirectFront;

#include <lightmap_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <shadowmask_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
    vec4 diffuseColor = vec4( diffuse, opacity );
    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
    vec3 totalEmissiveRadiance = emissive;

    // accumulation
    reflectedLight.indirectDiffuse += vIndirectFront;
    #include <lightmap_fragment>
    reflectedLight.indirectDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb );
    reflectedLight.directDiffuse = vLightFront;
    reflectedLight.directDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb ) * getShadowMask();
    // modulation
    vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
    gl_FragColor = vec4( outgoingLight, diffuseColor.a );
}
