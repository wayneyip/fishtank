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

		this.aim = new THREE.Vector3(0,0,0)
		this.velocity = new THREE.Vector3(0, 0.1, 0); 
		this.up = new THREE.Vector3(0,1,0); 
	}

	move()
	{
		this.mesh.position.x += this.velocity.x;
		this.mesh.position.y += this.velocity.y;
		this.mesh.position.z += this.velocity.z;

		this.aim.copy(this.mesh.position).add(this.velocity);
		this.mesh.lookAt(this.aim);
	}
} 

// Geometry
const geometry = new THREE.ConeGeometry(1, 2)
geometry.rotateX(0.5 * Math.PI)
const material = new THREE.MeshLambertMaterial({ color: 0xaaaaaa })

// Boids 
var boids = []
const boidScale = 0.1;
const spawnRange = 1;
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
dirLight.target = boids[3].mesh

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

var perceivedCenter = new THREE.Vector3(0,0,0)
var perceivedVelocity = new THREE.Vector3(0,0,0)
var displacement = new THREE.Vector3(0,0,0)
var vectorTo = new THREE.Vector3(0,0,0)

// Animations
const tick = () => {

	const elapsedTime = clock.getElapsedTime()

	// Update boids

	for (let boid of boids)
	{
		perceivedCenter.set(0, 0, 0)
		perceivedVelocity.set(0, 0, 0)
		displacement.set(0, 0, 0)

		for (let otherboid of boids)
		{
			if (boid != otherboid) 
			{
				// Cohesion
				perceivedCenter.add(otherboid.mesh.position)
				
				// Alignment
				perceivedVelocity.add(otherboid.velocity)
				
				// Separation
				if (boid.mesh.position.distanceTo(otherboid.mesh.position) < .5)
				{
					vectorTo.subVectors(otherboid.mesh.position, boid.mesh.position)
					displacement.sub(vectorTo)
				}
			}
		}
		perceivedCenter.divideScalar(boids.length - 1)
		perceivedVelocity.divideScalar(boids.length - 1)
		const cohesionVec = perceivedCenter.sub(boid.mesh.position).multiplyScalar(0.001);
		const alignmentVec = perceivedVelocity.sub(boid.velocity).multiplyScalar(0.125)
		const separationVec = displacement.multiplyScalar(.01)

		boid.velocity.add(cohesionVec);
		boid.velocity.add(alignmentVec);
		boid.velocity.add(separationVec);
		boid.velocity.clampLength(0, 0.03)
		
		boid.move();
	}

	// Render
	renderer.render(scene, camera)

	window.requestAnimationFrame(tick)
}
tick()