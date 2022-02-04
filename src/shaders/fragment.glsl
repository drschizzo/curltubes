uniform vec2 resolution;
uniform float time;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;

void main(){
    float diffuse=max(0.0,dot(vNormal,vec3(0.0,0.0,1.0)));
    gl_FragColor=vec4(vUv.xy,0.,1.)*vec4(diffuse);

}