import * as THREE from 'three'
import Boid from './Boid'
import {randomNumber} from './MathUtils'

const cohesionFactor 			= 0.00001
const alignmentFactor 			= 0.0075
const separationFactor 			= 0.01
const separationDistance		= 0.64
const mouseAvoidanceDistance 	= 3.0
const mouseAvoidanceFactor 		= 0.1
const boundsAvoidanceFactor 	= 0.0005
const boundsRange 				= 2.5
const maxSpeed 					= 0.03

export default class BoidGroup
{
	constructor(boidMeshes, boidScale, spawnRange)
	{
		this.boids = []

		for (let mesh of boidMeshes)
		{
			const boid = new Boid(mesh, boidScale, spawnRange)
			this.boids.push(boid)
		}
		
		// Cached values 
		// (for avoiding repeated creation in simulate())
		this.perceivedCenter = new THREE.Vector3()
		this.perceivedVelocity = new THREE.Vector3()
		this.displacement = new THREE.Vector3()
		this.vectorDiff = new THREE.Vector3()
		this.closestPointToRay = new THREE.Vector3()
		this.boidDirection = new THREE.Vector3()
		this.boundsAvoidance = new THREE.Vector3()
	}

	simulate(elapsedTime, rayToAvoid)
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
					if (boid.mesh.position.distanceToSquared(otherboid.mesh.position) < separationDistance)
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

			// ***** Mouse ray avoidance *****
			//
			if (rayToAvoid)
			{
				// Get the vector from boid to mouse ray
				rayToAvoid.closestPointToPoint(boid.mesh.position, this.closestPointToRay)
				const boidToRayVec = this.closestPointToRay.sub(boid.mesh.position)
				//
				// Get distance from boid to mouse ray
				const boidSqDistanceToRay = rayToAvoid.distanceSqToPoint(boid.mesh.position)
				//
				// If boid is approaching mouse ray...
				const isFacingRay = boid.velocity.dot(boidToRayVec) > 0
				const isCloseToRay = boidSqDistanceToRay < mouseAvoidanceDistance
				if (isFacingRay && isCloseToRay)
				{
					// ...Steer away from mouse ray
					const rayToBoidVec = boidToRayVec.negate()
					const mouseAvoidanceVec = rayToBoidVec.multiplyScalar(mouseAvoidanceFactor)
					boid.velocity.add(mouseAvoidanceVec)
				}
			}
			
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