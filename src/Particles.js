import * as THREE from 'three'

export default class Particles
{
	constructor(resources)
	{
		// Geometry
		this.geometry = new THREE.BufferGeometry()
		const particlesCount = 500
		const particlesBounds = 20
		const particlesPosArray = new Float32Array(particlesCount * 3)
		for (let i=0; i < particlesCount * 3; i++)
		{
			particlesPosArray[i] = (Math.random() - 0.5) * particlesBounds
		}
		this.geometry.setAttribute('position', new THREE.BufferAttribute(particlesPosArray, 3))

		// Textures
		const particlesDiffuse = resources.items['particles_a']

		// Material
		this.material = new THREE.PointsMaterial({
			size: 0.1,
			map: particlesDiffuse,
			transparent: true,
			opacity: 0.4
		})

		// Mesh
		this.mesh = new THREE.Points(this.geometry, this.material)
	}

	update(elapsedTime)
	{
		this.mesh.rotation.x -= 0.002
	}
}