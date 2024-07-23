import * as THREE from 'three'
import {randomNumber} from './Utils'

const initialMaxSpeed = 0.01

export default class Boid
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
			randomNumber(-initialMaxSpeed, initialMaxSpeed),
			randomNumber(-initialMaxSpeed, initialMaxSpeed),
			randomNumber(-initialMaxSpeed, initialMaxSpeed)
		)

		this.aim = new THREE.Vector3(0,0,0)
	}

	move()
	{
		this.mesh.position.x += this.velocity.x
		this.mesh.position.y += this.velocity.y
		this.mesh.position.z += this.velocity.z

		this.aim.copy(this.mesh.position).add(this.velocity)
		this.mesh.lookAt(this.aim)
	}
} 

