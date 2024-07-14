import * as THREE from 'three'
import Boid from './Boid'
import {randomNumber} from './Utils'

const cohesionFactor 		= 0.00005
const alignmentFactor 		= 0.01
const separationFactor 		= 0.01
const separationDistance	= 0.8
const boundsAvoidanceFactor = 0.001
const boundsRange 			= 3
const maxSpeed 				= 0.05

export default class BoidGroup
{
	constructor(boidGeo, boidMat, uniforms, boidCount, boidScale, spawnRange)
	{
		this.boids = []

		for (let i=0; i < boidCount; i++)
		{
			const boidMatClone = boidMat.clone()

			boidMatClone.onBeforeCompile = (shader) =>
			{
				shader.uniforms.uAmplitude = uniforms.uAmplitude
				shader.uniforms.uWavelength = uniforms.uWavelength
				shader.uniforms.uWaveSpeed = uniforms.uWaveSpeed
				shader.uniforms.uTime = uniforms.uTime
				shader.uniforms.uCausticsMap = uniforms.uCausticsMap
				
				// Give each fish's material a different offset for sine wave
				shader.uniforms.uOffset = randomNumber(0.0, 10.0)

				shader.vertexShader = shader.vertexShader.replace(
					'varying vec3 vViewPosition;',
					`
					varying vec3 vViewPosition;
					uniform float uAmplitude;
					uniform float uWavelength;
					uniform float uOffset;
					uniform float uWaveSpeed;
					uniform float uTime;
					`
				)
				shader.vertexShader = shader.vertexShader.replace(
					'#include <begin_vertex>',
					`
					#include <begin_vertex>
					transformed.x += uAmplitude * sin(uWavelength * (transformed.z + uOffset) + uWaveSpeed * uTime);
					`
				) 
				shader.fragmentShader = shader.fragmentShader.replace(
					'uniform vec3 diffuse;',
					`
					uniform vec3 diffuse;
					uniform sampler2D uCausticsMap;
					`
				)
				shader.fragmentShader = shader.fragmentShader.replace(
					'vec4 diffuseColor = vec4( diffuse, opacity );',
					`
					vec4 diffuseColor = vec4( diffuse, opacity );
					diffuseColor += texture2D( uCausticsMap, vMapUv * 0.1 );

					`
				) 

				boidMatClone.userData.shader = shader
			}
			const mesh = new THREE.Mesh(boidGeo, boidMatClone)	
			mesh.castShadow = true
			mesh.receiveShadow = true

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

	simulate(elapsedTime)
	{
		for (let boid of this.boids)
		{
			if (boid.mesh.material.userData.shader)
			{
				boid.mesh.material.userData.shader.uniforms.uTime.value = elapsedTime
			}

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
			// boid.move()
		}
	}
}