uniform vec2 resolution;
uniform float time;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;

void main(){
 //   gl_FragColor = vec4(gl_FragCoord.x/resolution.x, gl_FragCoord.y/resolution.y, 0.0, 1.0);
    vec3 col=vec3(1.0,0.0,0.0);
    float diffuse=dot(normalize(vNormal),normalize(vec3(0.0,1.0,1.0)));
    
    diffuse=clamp(diffuse,-.2,1.)/1.2+.2;//*0.5+0.5;
    vec3 light=normalize(vec3(0.0,1.0,1.0));
    vec3 viewDir=normalize(vViewPosition-vPosition);
   // float spec=clamp(pow(max(dot(normalize(vNormal),normalize(light+viewDir)),0.0),40.0),0.,1.);
     float spec=max(0.,dot(-reflect(normalize(vec3(0.0,1.0,1.0)),normalize(vNormal)),viewDir));
    spec=pow(spec,60.0);
    gl_FragColor = vec4(min(col*diffuse+spec,vec3(1.)), 1.0);

    gl_FragColor=pow(gl_FragColor,vec4(.45));

}