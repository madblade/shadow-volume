
uniform vec3 lightPosition;
uniform bool isShadow;
uniform float bias;

varying vec3 vViewPosition;

varying vec3 vLightFront;
varying vec3 vIndirectFront;
#include <bsdfs>
#include <lights_pars_begin>
#include <color_pars_vertex>

void main()
{
    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>
    #include <begin_vertex>
    #include <skinning_vertex>
    #include <project_vertex>
    #include <worldpos_vertex>
    #include <lights_lambert_vertex>

    vec3 translated = position;
    vec3 nlight = normalize(lightPosition);
    float d = dot(normalize(normal), nlight);

    if (isShadow)
    {
        vec3 infty;
        if (d < bias) {
            infty = position - nlight * 1000000.0;
        } else {
            //infty = position - nlight * 0.1; // normal * 0.5; // To expose
            infty = position - normal * 0.1; // To expose
        }
        translated = infty;
        vec4 newMvPosition =  modelViewMatrix * vec4(translated, 1.0);
        gl_Position = projectionMatrix * newMvPosition;
    }

    #include <envmap_vertex>
    #include <shadowmap_vertex>
    #include <fog_vertex>
}
