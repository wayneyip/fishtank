import * as THREE from 'three'

class Boid
{
	constructor(mesh, scale, spawnRange)
	{
		this.mesh = mesh

		mesh.scale.x = scale
		mesh.scale.y = scale
		mesh.scale.z = scale

		mesh.position.x = randomNumber(-spawnRange, spawnRange) 
		mesh.position.y = randomNumber(-spawnRange, spawnRange)
		mesh.position.z = randomNumber(-spawnRange, spawnRange)

		this.velocity = new THREE.Vector3(
			randomNumber(-0.1,0.1),
			randomNumber(-0.1,0.1),
			randomNumber(-0.1,0.1)
		)

		this.aim = new THREE.Vector3(0,0,0)
	}

	// flock(otherboids)
	// {
	// 	v1 = cohesion(otherboids)
	// 	v2 = alignment(otherboids)
	// 	v3 = separation(otherboids)
	// }

	move()
	{
		this.mesh.position.x += this.velocity.x
		this.mesh.position.y += this.velocity.y
		this.mesh.position.z += this.velocity.z

		this.aim.copy(this.mesh.position).add(this.velocity)
		this.mesh.lookAt(this.aim)
	}
} 

function randomNumber(min, max) 
{
	return Math.random() * (max - min) + min
}

export { Boid }