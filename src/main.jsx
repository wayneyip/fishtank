import * as THREE from 'three'
import Resources from './Resources'
import sources from './Sources'
import Skybox from './Skybox'
import Godrays from './Godrays'
import Fish from './Fish'
import Ground from './Ground'
import Particles from './Particles'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui'

// Canvas
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
dirLight.castShadow = true
dirLight.position.y = 100
scene.add(dirLight)
const ambientLight = new THREE.AmbientLight()
ambientLight.intensity = 1.0
scene.add(ambientLight)

// Loaders
const resources = new Resources(sources)
let skybox, fish, ground, particles

resources.on('ready', () => {

	// Skybox
	const skybox = new Skybox(resources)
	scene.add(skybox.mesh)

	// Godrays
	const godrays = new Godrays(resources)
	scene.add(godrays.mesh)

	// Fish 
	fish = new Fish(resources)
	for (const f of fish.boidGroup.boids)
	{
		scene.add(f.mesh)
	}

	// Ground
	ground = new Ground(resources)
	scene.add(ground.mesh)

	// Particles
	particles = new Particles(resources)
	scene.add(particles.mesh)
})

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
renderer.shadowMap.enabled = true
renderer.setSize(size.width, size.height)

// Controls
const controls = new OrbitControls( camera, renderer.domElement );

// Time
const clock = new THREE.Clock()
const tick = () => {

	const elapsedTime = clock.getElapsedTime()

	if (fish)
		fish.update(elapsedTime)
	if (ground)
		ground.update(elapsedTime)
	if (particles)
		particles.update(elapsedTime)

	// Render
	renderer.render(scene, camera)

	window.requestAnimationFrame(tick)
}
tick()