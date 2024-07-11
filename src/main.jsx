import * as THREE from 'three'
import Resources from './Resources'
import Fish from './Fish'
import Ground from './Ground'
import Particles from './Particles'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui'

import waterVertexShader from './shaders/waterVertex.glsl'
import waterFragmentShader from './shaders/waterFragment.glsl'

const canvas = document.querySelector('canvas.webgl')

// GUI
const gui = new GUI()
window.addEventListener('keydown', (event) =>
{
	if (event.key == 'd')
	{
		gui.show(gui._hidden)
	}
})

// Scene
const scene = new THREE.Scene()
scene.fog = new THREE.Fog( 0x02649a, 50, 150 )
scene.background = new THREE.Color( 0x02649a )

// Lighting
const dirLight = new THREE.DirectionalLight()
scene.add(dirLight)

// Skybox
const skySize = 1000
const skyGeo = new THREE.SphereGeometry(skySize)
const skyMat = new THREE.ShaderMaterial({
	vertexShader: waterVertexShader,
	fragmentShader: waterFragmentShader,
	side: THREE.BackSide,
	uniforms:
	{
		uTopColor: { value: new THREE.Vector4(1,1,1,1) },
		uBottomColor: { value: new THREE.Vector4(0.007,0.392,0.604,1) }
	}
})
const skyMesh = new THREE.Mesh(skyGeo, skyMat)
scene.add(skyMesh)

// Loaders
var resources = new Resources()

// Fish
var fish = new Fish(resources)
console.log(fish.boidGroup)
for (const boid of fish.boidGroup.boids)
{
	scene.add(boid.mesh)
}

// Ground
var ground = new Ground(resources)
scene.add(ground.mesh)

// Particles
var particles = new Particles(resources)
scene.add(particles.mesh)

// Screen size
const size = {
	width: window.innerWidth,
	height: window.innerHeight
}
window.addEventListener('resize', () =>
{
	size.width = window.innerWidth
	size.height = window.innerHeight

	camera.aspect = size.width / size.height
	camera.updateProjectionMatrix()

	renderer.setSize(size.width, size.height)
})

// Camera
const camera = new THREE.PerspectiveCamera(45, size.width/size.height)
camera.position.z = 10
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true
})
renderer.setSize(size.width, size.height)

// Controls
const controls = new OrbitControls( camera, renderer.domElement );

// Time
const clock = new THREE.Clock()
const tick = () => {

	const elapsedTime = clock.getElapsedTime()

	fish.update(elapsedTime)
	ground.update(elapsedTime)
	particles.update(elapsedTime)

	// Render
	renderer.render(scene, camera)

	window.requestAnimationFrame(tick)
}
tick()