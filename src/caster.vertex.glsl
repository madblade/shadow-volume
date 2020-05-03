
uniform vec3 lightPosition;
uniform bool isShadow1;
uniform bool isShadow2;
uniform float bias;

varying vec3 vViewPosition;
#ifndef FLAT_SHADED
varying vec3 vNormal;
#endif

#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
    #include <uv_vertex>
    #include <uv2_vertex>
    #include <color_vertex>
    #include <beginnormal_vertex>
    #include <morphnormal_vertex>
    #include <skinbase_vertex>
    #include <skinnormal_vertex>
    #include <defaultnormal_vertex>
    #ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED
    vNormal = normalize( transformedNormal );
    #endif
    #include <begin_vertex>
    #include <morphtarget_vertex>
    #include <skinning_vertex>
    #include <displacementmap_vertex>
    #include <project_vertex>
    #include <logdepthbuf_vertex>
    #include <clipping_planes_vertex>
    vViewPosition = - mvPosition.xyz;

    #include <worldpos_vertex>

    vec3 translated = position;
//    vec3 nlight = normalize(lightPosition);
    vec3 nlight = normalize(lightPosition - modelMatrix[3].xyz);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    float d = dot(normalize(normal), nlight);

    if (isShadow1 || isShadow2)
    {
        float sign = isShadow1 ? 1.0 : -1.0;
        vec3 infty;
        if (d < bias * sign) {
            infty = position - nlight * 100.0;
        } else {
            infty = position - normal * 0.5;
        }
        translated = infty;
        vec4 newMvPosition =  modelViewMatrix * vec4(translated, 1.0);
        gl_Position = projectionMatrix * newMvPosition;
    }

    #include <envmap_vertex>
    #include <shadowmap_vertex>
    #include <fog_vertex>
}
