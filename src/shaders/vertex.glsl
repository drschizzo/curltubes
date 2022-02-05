varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;
attribute vec3 color;
varying vec3 vColor;
uniform float time;

void main(){
    vUv=uv;
    vColor=color;
    vNormal=normal;
    vViewPosition=cameraPosition;
    vPosition=position+normal*(0.03+((sin(vUv.x*20.+time+vColor.g)*.5+.5)/8.));
    gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );
    gl_PointSize=3.0;
}