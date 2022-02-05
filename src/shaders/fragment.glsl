uniform vec2 resolution;
uniform float time;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;
varying vec3 vColor;

void main(){
    float diffuse=max(0.0,dot(vNormal,vec3(0.0,0.0,1.0)));

    float dash=mod(vUv.x*5.+time*.1+vColor.r+vUv.y*1.,1.0);
    dash=step(0.4,dash);
    

    vec3 viewDir=normalize(-vViewPosition+vPosition);
    float specular=pow(max(0.0,dot(viewDir,reflect(normalize(vec3(0.0,0.0,1.0)),vNormal))),10.);
    vec3 col=vec3(.3,.5,.8);
    vec4 col1=vec4(sin(col+vColor),1.0);
    col1=vec4(vColor,1.);
    gl_FragColor=col1*vec4(diffuse)+vec4(specular);
    gl_FragColor.a=1.0;
    if(dash<.5){
        //gl_FragColor.a=.3;
        discard;
    }
    //gl_FragColor.a=gl_FragColor.a-(length(vPosition)/8.);

}