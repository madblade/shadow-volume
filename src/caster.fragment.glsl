
uniform vec3 lightPosition;

varying vec3 vNormal;

void main()
{
    float fac = dot(vNormal, lightPosition);
    gl_FragColor = vec4(fac * vec3(1.0), 1.0);
}
