import * as THREE from 'three'
import {BoidGroup} from './BoidGroup'

const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Lighting
const dirLight = new THREE.DirectionalLight()
scene.add(dirLight)
const ambLight = new THREE.AmbientLight()
scene.add(ambLight)

// Geometry
const geometry = new THREE.ConeGeometry(1, 2)
geometry.rotateX(0.5 * Math.PI)
const material = new THREE.MeshLambertMaterial({ color: 0xaaaaaa })

// Boids 
const boidCount = 200
const boidScale = 0.1
const spawnRange = 2
var boidGroup = new BoidGroup(
	scene, geometry, material, 
	boidCount, boidScale, spawnRange
)

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
	canvas: canvas
})
renderer.setSize(size.width, size.height)

const clock = new THREE.Clock()

// Animations
const tick = () => {

	const elapsedTime = clock.getElapsedTime()

	boidGroup.simulate()

	// Render
	renderer.render(scene, camera)

	window.requestAnimationFrame(tick)
}
tick()