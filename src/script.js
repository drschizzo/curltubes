import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import * as dat from 'dat.gui'
import SimplexNoise from 'simplex-noise';



var fragmentshader = require('./shaders/fragment.glsl')
var vertexshader=require('./shaders/vertex.glsl')

const scene = new THREE.Scene()

const noise=new SimplexNoise()    


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
    camera.position.z = 2

    const renderer = new THREE.WebGLRenderer(
        {
            antialias: true
            
        
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
            }
        },
        vertexShader: vertexshader,
        fragmentShader: fragmentshader,
    })

    for(let i=0;i<200;i++){
        let positions = []
        let start=new THREE.Vector3(Math.random()-.5,Math.random()-.5,Math.random()-.5)
        positions.push(start)
        let currentpos=start.clone()
        for(let j=0;j<500;j++){
            let curl=computeCurl(currentpos.x,currentpos.y,currentpos.z)
            currentpos.x+=curl.x*0.0005//*(i+1)
            currentpos.y+=curl.y*0.0005//*(i+1)
            currentpos.z+=curl.z*0.0005//*(i+1)
            positions.push(currentpos.clone())

            
        

        }
        let curve=new THREE.CatmullRomCurve3(positions)
        
        
        let geometry = new THREE.TubeBufferGeometry(curve, 500, 0.01, 10, false);


    // geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))



        //create a shader material
        


    //  const cube = new THREE.Mesh(geometry, shaderMaterial)
        // let mesh=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial())
        let mesh=new THREE.Mesh(geometry,shaderMaterial)
        scene.add(mesh)
    }

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
    function animate() {
        requestAnimationFrame(animate)
      
       //  cube.rotation.x += 0.01
      //  cube.rotation.y += 0.01
        itime+=.01
        let time=itime
      

        

        
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