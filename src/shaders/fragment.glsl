uniform vec2 resolution;
uniform float time;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;

void main(){
    float diffuse=max(0.0,dot(vNormal,vec3(0.0,0.0,1.0)));

    float dash=mod(vUv.x*1.+time*.5,1.0);
    dash=step(0.5,dash);
    if(dash<.5){
        discard;
    }
    vec4 col1=vec4(0.1,0.1,0.6,1.0);
    
    gl_FragColor=col1*vec4(diffuse);

}