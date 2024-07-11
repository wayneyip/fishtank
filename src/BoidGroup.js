import * as THREE from 'three'
import {Boid} from './Boid'

const cohesionFactor 		= 0.00005
const alignmentFactor 		= 0.01
const separationFactor 		= 0.01
const separationDistance	= 0.8
const boundsAvoidanceFactor = 0.001
const boundsRange 			= 3
const maxSpeed 				= 0.05

function randomNumber(min, max) 
{
	return Math.random() * (max - min) + min
}

class BoidGroup
{
	constructor(boidGeo, boidMat, boidCount, boidScale, spawnRange)
	{
		this.boids = []

		for (let i=0; i < boidCount; i++)
		{
			// Give each fish's material a different offset for sine wave
			var boidMatClone = boidMat.clone()
			boidMatClone.uniforms.uOffset.value = randomNumber(0.0, 1000.0)

			const mesh = new THREE.Mesh(boidGeo, boidMatClone)	
			const boid = new Boid(mesh, boidScale, spawnRange)
			this.boids.push(boid)
		}
		
		// Cached values 
		// (for avoiding repeated creation in simulate())
		this.perceivedCenter = new THREE.Vector3(0,0,0)
		this.perceivedVelocity = new THREE.Vector3(0,0,0)
		this.displacement = new THREE.Vector3(0,0,0)
		this.vectorDiff = new THREE.Vector3(0,0,0)
		this.boundsAvoidance = new THREE.Vector3(0,0,0)
	}

	simulate()
	{
		for (let boid of this.boids)
		{
			this.perceivedCenter.set(0,0,0)
			this.perceivedVelocity.set(0,0,0)
			this.displacement.set(0,0,0)
			this.boundsAvoidance.set(0,0,0)

			for (let otherboid of this.boids)
			{
				if (boid != otherboid) 
				{
					// Cohesion
					this.perceivedCenter.add(otherboid.mesh.position)
					
					// Alignment
					this.perceivedVelocity.add(otherboid.velocity)
					
					// Separation
					if (boid.mesh.position.distanceTo(otherboid.mesh.position) < separationDistance)
					{
						this.vectorDiff.subVectors(otherboid.mesh.position, boid.mesh.position)
						this.displacement.sub(this.vectorDiff)
					}
				}
			}

			// Average the total position and velocity
			// to get group's perceived center and velocity
			this.perceivedCenter.divideScalar(this.boids.length - 1)
			this.perceivedVelocity.divideScalar(this.boids.length - 1)

			// Calculate flocking vectors
			const cohesionVec = this.perceivedCenter.sub(boid.mesh.position).multiplyScalar(cohesionFactor)
			const alignmentVec = this.perceivedVelocity.sub(boid.velocity).multiplyScalar(alignmentFactor)
			const separationVec = this.displacement.multiplyScalar(separationFactor)

			// Bounds avoidance 
			if (boid.mesh.position.x < -boundsRange)
			{
				this.boundsAvoidance.x = 1
			}
			else if (boid.mesh.position.x > boundsRange)
			{
				this.boundsAvoidance.x = -1
			}
			if (boid.mesh.position.y < -boundsRange)
			{
				this.boundsAvoidance.y = 1
			}
			else if (boid.mesh.position.y > boundsRange)
			{
				this.boundsAvoidance.y = -1
			}
			if (boid.mesh.position.z < -boundsRange)
			{
				this.boundsAvoidance.z = 1
			}
			else if (boid.mesh.position.z > boundsRange)
			{
				this.boundsAvoidance.z = -1
			}
			this.boundsAvoidance.multiplyScalar(boundsAvoidanceFactor)

			// Apply all steerings to boid's velocity
			boid.velocity.add(cohesionVec)
			boid.velocity.add(alignmentVec)
			boid.velocity.add(separationVec)
			boid.velocity.add(this.boundsAvoidance)

			// Limit boid velocity
			boid.velocity.clampLength(0, maxSpeed)
			
			// Move boid using updated velocity
			boid.move()
		}
	}
}

export { BoidGroup }