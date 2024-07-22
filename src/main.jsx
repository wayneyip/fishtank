import * as THREE from 'three'
import Resources from './Resources'
import sources from './Sources'
import Lighting from './Lighting'
import Skybox from './Skybox'
import Godrays from './Godrays'
import Surface from './Surface'
import Fish from './Fish'
import Ground from './Ground'
import Particles from './Particles'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'stats.js'
import GUI from 'lil-gui'

// Parameters
const guiToggleKey = 'd'
const fogColor = 0x0087bf
const fogStart = 0 
const fogEnd = 150
const cameraFOV = 55
const cameraZPos = 5

// Canvas
const canvas = document.querySelector('canvas.webgl')

// GUI
const gui = new GUI()
gui.hide()
window.addEventListener('keydown', (event) =>
{
	if (event.key == guiToggleKey)
	{
		gui.show(gui._hidden)
	}
})

// Scene + fog
const scene = new THREE.Scene()
scene.fog = new THREE.Fog( fogColor, fogStart, fogEnd )
scene.background = new THREE.Color( fogColor )

// Lighting
const lighting = new Lighting()
scene.add(lighting.directionalLight)
scene.add(lighting.ambientLight)
scene.add(lighting.lightTargetMesh)

// Loaders
const resources = new Resources(sources)
let skybox, surface, fish, ground, particles, godrays

resources.on('ready', () => {

	// Skybox
	skybox = new Skybox(resources)
	scene.add(skybox.mesh)

	// Surface
	surface = new Surface(resources)
	scene.add(surface.mesh)
	
	// Godrays
	godrays = new Godrays(resources)
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
const camera = new THREE.PerspectiveCamera(cameraFOV, size.width/size.height)
camera.position.z = cameraZPos
camera.rotateX( 0.05 * Math.PI )
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true
})
renderer.shadowMap.enabled = true
renderer.setSize(size.width, size.height)

// Controls
// const controls = new OrbitControls( camera, renderer.domElement );

// Interactivity
const mousePos = new THREE.Vector2()
const raycaster = new THREE.Raycaster()

window.addEventListener('mousedown', () => {

})
window.addEventListener('mouseup', () => {

})
window.addEventListener('mousemove', () => {
	mousePos.x = (event.clientX / window.innerWidth) * 2 - 1
	mousePos.y = -(event.clientY / window.innerHeight) * 2 + 1	
})

// Stats
const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

// Time
const clock = new THREE.Clock()
const tick = () => {

	stats.begin()

	// Raycasting
	raycaster.setFromCamera(mousePos, camera)
	const mouseRay = raycaster.ray 

	// Animation
	const elapsedTime = clock.getElapsedTime()

	if (fish)
		fish.update(elapsedTime, mouseRay)
	if (surface)
		surface.update(elapsedTime)
	if (ground)
		ground.update(elapsedTime)
	if (particles)
		particles.update(elapsedTime)
	if (godrays)
		godrays.update(elapsedTime)

	// Render
	renderer.render(scene, camera)

	window.requestAnimationFrame(tick)

	stats.end()
}
tick()