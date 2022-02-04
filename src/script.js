import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import * as dat from 'dat.gui'
import SimplexNoise from 'simplex-noise';



var fragmentshader = require('./shaders/fragment.glsl')
var vertexshader=require('./shaders/vertex.glsl')

const scene = new THREE.Scene()

const noise=new SimplexNoise()    

let settings={
}

function computeCurl(x, y, z){
    var eps = 0.0001;
  
    var curl = new THREE.Vector3();
  
    //Find rate of change in YZ plane
    var n1 = noise.noise3D(x, y + eps, z); 
    var n2 = noise.noise3D(x, y - eps, z); 
    //Average to find approximate derivative
    var a = (n1 - n2)/(2 * eps);
    var n1 = noise. noise3D(x, y, z + eps); 
    var n2 = noise.noise3D(x, y, z - eps); 
    //Average to find approximate derivative
    var b = (n1 - n2)/(2 * eps);
    curl.x = a - b;
  
    //Find rate of change in XZ plane
    n1 = noise.noise3D(x, y, z + eps); 
    n2 = noise.noise3D(x, y, z - eps); 
    a = (n1 - n2)/(2 * eps);
    n1 = noise.noise3D(x + eps, y, z); 
    n2 = noise.noise3D(x - eps, y, z); 
    b = (n1 - n2)/(2 * eps);
    curl.y = a - b;
  
    //Find rate of change in XY plane
    n1 = noise.noise3D(x + eps, y, z); 
    n2 = noise.noise3D(x - eps, y, z); 
    a = (n1 - n2)/(2 * eps);
    n1 = noise.noise3D(x, y + eps, z); 
    n2 = noise.noise3D(x, y - eps, z); 
    b = (n1 - n2)/(2 * eps);
    curl.z = a - b;
  
    return curl;
  }

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 9

    const renderer = new THREE.WebGLRenderer(
        {
            
            
        
        }
    )
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)


    let orbitControls = new OrbitControls(camera, renderer.domElement);

  //  let geometry = new THREE.BufferGeometry()
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
        
    })

    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            resolution: {
                value: new THREE.Vector2(window.innerWidth, window.innerHeight)
            },
            time: {
                value: 0
            },
            
            
        },
        vertexShader: vertexshader,
        fragmentShader: fragmentshader,
    })
    let start = Date.now()
    for(let i=0;i<200;i++){
        let positions = []
        let colors = []
        let color = new THREE.Color(Math.random(), Math.random(), Math.random()).offsetHSL(0.5, 0.8, 0.2)
        let start=new THREE.Vector3(Math.random()-.5,Math.random()-.5,Math.random()-.5).multiplyScalar(5)
        positions.push(start)
        let currentpos=start.clone()
        for(let j=0;j<300;j++){
            let curl=computeCurl(currentpos.x/5.,currentpos.y/5.,currentpos.z/5.)
            currentpos.x+=curl.x*0.01//*(i+1)
            currentpos.y+=curl.y*0.01//*(i+1)
            currentpos.z+=curl.z*0.01//*(i+1)
            positions.push(currentpos.clone())
            
        

        }
        let curve=new THREE.CatmullRomCurve3(positions)
        
        
        let geometry = new THREE.TubeBufferGeometry(curve, 300, 0.001, 10, false);

        for(let a=0;a<geometry.attributes.position.count;a++){
            colors.push(color.r,color.g,color.b)
        }

        
        geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))

    // geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))



        //create a shader material
       // shaderMaterial.uniforms.color.value.setHSL(Math.random(), 0.5, 0.5)


    //  const cube = new THREE.Mesh(geometry, shaderMaterial)
        // let mesh=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial())
        let mesh=new THREE.Mesh(geometry,shaderMaterial)
        scene.add(mesh)
    }
    let end = Date.now()
    console.log("duration",end-start)
    // window.addEventListener('click', (e) => {
    //     console.log(cube.geometry.getAttribute('position'))
    //     cube.geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array([
    //         Math.random() * 2 - 1,
    //         Math.random() * 2 - 1,
    //         Math.random() * 2 - 1
    //     ]), 3))
    //     cube.geometry.attributes.position.needsUpdate = true
    // })

    window.addEventListener(
        'resize',
        () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
            render()
        },
        false
    )

    const stats = Stats()
    document.body.appendChild(stats.dom)


   

    // const gui = new dat.GUI()
    // const cubeFolder = gui.addFolder('Cube')
    // cubeFolder.add(cube.scale, 'x', -5, 5)
    // cubeFolder.add(cube.scale, 'y', -5, 5)
    // cubeFolder.add(cube.scale, 'z', -5, 5)
    // cubeFolder.open()
    // const cameraFolder = gui.addFolder('Camera')
    // cameraFolder.add(camera.position, 'z', 0, 10)
    // cameraFolder.open()
    let itime=0
    let lasttime=new Date().getTime()
    function animate() {
        requestAnimationFrame(animate)
      
       //  cube.rotation.x += 0.01
      //  cube.rotation.y += 0.01
        itime+=(new Date().getTime()-lasttime)/1000
        lasttime=new Date().getTime()
        let time=itime
      
        shaderMaterial.uniforms.time.value=itime
        

        
      //  geometry.setAttribute('position', new THREE.Float32BufferAttribute(newpositions, 3))
      //  geometry.attributes.position.needsUpdate = true
      
        render()
        orbitControls.update()
        stats.update()
    }

    function render() {
        renderer.render(scene, camera)
    }

    animate()