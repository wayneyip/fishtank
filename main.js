import * as THREE from 'three'
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
const material = new THREE.MeshLambertMaterial({ color: 0xaaaaaa })
var boids = []
const boidScale = 0.1;
const spawnRange = 3;
const boidCount = 100;
const boidVelocity = new THREE.Vector3(1, 1, 1);

function randomNumber(min, max) 
{
	return Math.random() * (max - min) + min;
}

for (let i=0; i < boidCount; i++)
{
	const boid = new THREE.Mesh(geometry, material)	
	boid.scale.x = boidScale;
	boid.scale.y = boidScale;
	boid.scale.z = boidScale;
	const x = randomNumber(-spawnRange, spawnRange)
	const y = randomNumber(-spawnRange, spawnRange)
	const z = randomNumber(-spawnRange, spawnRange)
	boid.position.x = x; 
	boid.position.y = y; 
	boid.position.z = z; 
	scene.add(boid)
	boids.push(boid)
}
dirLight.target = boids[25]

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