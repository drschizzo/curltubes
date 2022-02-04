import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import * as dat from 'dat.gui'


var fragmentshader = require('./shaders/fragment.glsl')
var vertexshader=require('./shaders/vertex.glsl')

const scene = new THREE.Scene()

    

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

    const geometry = new THREE.SphereBufferGeometry(1, 320, 320)
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
        
    })


    //create a shader material
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


    const cube = new THREE.Mesh(geometry, shaderMaterial)
    const particules=new THREE.Points(geometry,shaderMaterial)
    scene.add(particules)


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

    function animate() {
        requestAnimationFrame(animate)
      //  cube.rotation.x += 0.01
      //  cube.rotation.y += 0.01
        
        let position = cube.geometry.getAttribute('position').array;
        for(let i=0;i<position.length;i+=3){
            position[i]+=(Math.random()-.5)*0.01
            position[i+1]+=(Math.random()-.5)*0.01
            position[i+2]+=(Math.random()-.5)*0.01
        }
        cube.geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3))
        cube.geometry.attributes.position.needsUpdate = true
      
        render()
        orbitControls.update()
        stats.update()
    }

    function render() {
        renderer.render(scene, camera)
    }

    animate()