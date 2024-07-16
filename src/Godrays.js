import * as THREE from 'three'
import WorldObject from './WorldObject'

export default class Godrays extends WorldObject
{
	constructor(resources)
	{
		super(resources)
	}

	initGeometry()
	{
		const geometry = new THREE.ConeGeometry(
			5,
			5,
			32,
			1,
			true
		) 
		return geometry
	}

	initMaterial()
	{
		const material = new THREE.MeshLambertMaterial({
			color: 0xff0000,
			side: THREE.DoubleSide,
		})
		return material
	}

	initMesh()
	{
		const mesh = new THREE.Mesh(this.geometry, this.material)
		mesh.position.y = 4
		return mesh
	}
}