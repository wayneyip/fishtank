import * as THREE from 'three'
import WorldObject from './WorldObject'

const particlesCount 	= 500
const particlesBounds 	= 20
const particleSize 		= 0.1
const particleOpacity 	= 0.4
const particleSpeed 	= 0.002

export default class Particles extends WorldObject
{
	constructor(resources)
	{
		super(resources)
	}

	initGeometry()
	{
		const geometry = new THREE.BufferGeometry()
		const particlesPosArray = new Float32Array(particlesCount * 3)
		
		for (let i=0; i < particlesCount * 3; i++)
		{
			particlesPosArray[i] = (Math.random() - 0.5) * particlesBounds
		}
		
		geometry.setAttribute('position', new THREE.BufferAttribute(particlesPosArray, 3))

		return geometry
	}

	initMaterial()
	{
		const particlesDiffuse = this.resources.items['particles_a']

		return new THREE.PointsMaterial({
			size  		: particleSize,
			map 		: particlesDiffuse,
			transparent	: true,
			opacity 	: particleOpacity
		})
	}

	initMesh()
	{
		const mesh = new THREE.Points(this.geometry, this.material)

		return mesh
	}

	update(elapsedTime)
	{
		this.mesh.rotation.x -= particleSpeed
	}
}