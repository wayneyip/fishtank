import * as THREE from 'three'
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Lighting
const dirLight = new THREE.DirectionalLight()
scene.add(dirLight)
const ambLight = new THREE.AmbientLight()
scene.add(ambLight)

class Boid
{
	constructor(mesh, scale, spawnRange)
	{
		this.mesh = mesh

		mesh.scale.x = boidScale
		mesh.scale.y = boidScale
		mesh.scale.z = boidScale

		mesh.position.x = randomNumber(-spawnRange, spawnRange) 
		mesh.position.y = randomNumber(-spawnRange, spawnRange)
		mesh.position.z = randomNumber(-spawnRange, spawnRange)

		this.velocity = new THREE.Vector3(1, 1, 1); 
	}
} 

// Geometry
const geometry = new THREE.ConeGeometry(1, 2)
const material = new THREE.MeshLambertMaterial({ color: 0xaaaaaa })
var boids = []
const boidScale = 0.1;
const spawnRange = 3;
const boidCount = 100;

function randomNumber(min, max) 
{
	return Math.random() * (max - min) + min;
}

for (let i=0; i < boidCount; i++)
{
	const mesh = new THREE.Mesh(geometry, material)	
	const boid = new Boid(mesh, boidScale, spawnRange)
	scene.add(boid.mesh)
	boids.push(boid)
}
dirLight.target = boids[25].mesh

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
camera.position.z = 10;
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

	// Update objects
	for (let boid of boids)
	{
	}

	// Render
	renderer.render(scene, camera)

	window.requestAnimationFrame(tick)
}
tick()