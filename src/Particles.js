import * as THREE from 'three'
import WorldObject from './WorldObject'

export default class Particles extends WorldObject
{
	constructor(resources)
	{
		super(resources)
	}

	initGeometry()
	{
		let geometry = new THREE.BufferGeometry()

		const particlesCount = 500
		const particlesBounds = 20
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
			size: 0.1,
			map: particlesDiffuse,
			transparent: true,
			opacity: 0.4
		})
	}

	initMesh()
	{
		return new THREE.Points(this.geometry, this.material)
	}

	update(elapsedTime)
	{
		this.mesh.rotation.x -= 0.002
	}
}