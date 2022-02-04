varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;


void main(){
    vUv=uv;
    vNormal=normal;
    vViewPosition=cameraPosition;
    vPosition=position+normal*0.03*(sin(vUv.x*3.14));
    gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );
    gl_PointSize=3.0;
}