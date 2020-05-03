
uniform vec3 lightPosition;
uniform bool isShadow1;
uniform bool isShadow2;

varying vec3 vNormal;

void main()
{
    vNormal = normal;
    vec3 translated = position;

    vec3 nlight = normalize(lightPosition);
    float d = dot(normalize(normal), nlight);
    if (isShadow1 && d < -0.1 || isShadow2 && d < 0.0)
    {
        vec3 infty = position - lightPosition * 1000.0;
        translated = infty;
    }

    vec4 mvPosition =  modelViewMatrix * vec4(translated, 1.0);
    gl_Position = projectionMatrix * mvPosition;
}
