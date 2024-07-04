import * as THREE from 'three'
import {Boid} from './Boid'

class BoidGroup
{
	constructor(scene, boidGeo, boidMat, boidCount, boidScale, spawnRange)
	{
		this.boids = []

		for (let i=0; i < boidCount; i++)
		{
			const mesh = new THREE.Mesh(boidGeo, boidMat)	
			const boid = new Boid(mesh, boidScale, spawnRange)
			scene.add(boid.mesh)
			this.boids.push(boid)
		}
		
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
			this.perceivedCenter.set(0, 0, 0)
			this.perceivedVelocity.set(0, 0, 0)
			this.displacement.set(0, 0, 0)
			this.boundsAvoidance.set(0, 0, 0)

			for (let otherboid of this.boids)
			{
				if (boid != otherboid) 
				{
					// Cohesion
					this.perceivedCenter.add(otherboid.mesh.position)
					
					// Alignment
					this.perceivedVelocity.add(otherboid.velocity)
					
					// Separation
					if (boid.mesh.position.distanceTo(otherboid.mesh.position) < .5)
					{
						this.vectorDiff.subVectors(otherboid.mesh.position, boid.mesh.position)
						this.displacement.sub(this.vectorDiff)
					}

					// Avoidance 
					if (boid.mesh.position.x < -5)
					{
						this.boundsAvoidance.x = 1
					}
					else if (boid.mesh.position.x > 5)
					{
						this.boundsAvoidance.x = -1
					}
					if (boid.mesh.position.y < -5)
					{
						this.boundsAvoidance.y = 1
					}
					else if (boid.mesh.position.y > 5)
					{
						this.boundsAvoidance.y = -1
					}
					if (boid.mesh.position.z < -5)
					{
						this.boundsAvoidance.z = 1
					}
					else if (boid.mesh.position.z > 5)
					{
						this.boundsAvoidance.z = -1
					}
					this.boundsAvoidance.multiplyScalar(0.001)
				}
			}
			this.perceivedCenter.divideScalar(this.boids.length - 1)
			this.perceivedVelocity.divideScalar(this.boids.length - 1)
			const cohesionVec = this.perceivedCenter.sub(boid.mesh.position).multiplyScalar(0.00005);
			const alignmentVec = this.perceivedVelocity.sub(boid.velocity).multiplyScalar(0.03)
			const separationVec = this.displacement.multiplyScalar(.01)

			boid.velocity.add(cohesionVec);
			boid.velocity.add(alignmentVec);
			boid.velocity.add(separationVec);
			boid.velocity.add(this.boundsAvoidance);
			boid.velocity.clampLength(0, 0.06)
			
			boid.move();
		}
	}
}

export { BoidGroup }