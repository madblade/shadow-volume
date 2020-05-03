
uniform vec3 lightPosition;

varying vec3 vNormal;

void main()
{
    float fac = dot(vNormal, normalize(lightPosition));
    gl_FragColor = vec4(fac * vec3(0.5, 0.5, 1.0), 1.0);
}
