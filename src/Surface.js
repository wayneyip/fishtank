import * as THREE from 'three'
import WorldObject from './WorldObject'

const surfaceSize = 1000

export default class Surface extends WorldObject
{
	constructor(resources)
	{
		super(resources)
	}

	initGeometry()
	{
		const geometry = new THREE.PlaneGeometry( surfaceSize, surfaceSize )

		return geometry
	}

	initMaterial()
	{
		const material = new THREE.MeshBasicMaterial({
			color: 0xaaaaff
		})

		return material
	}

	initMesh()
	{
		const mesh = new THREE.Mesh(this.geometry, this.material)
		mesh.rotateX(0.5 * Math.PI)
		mesh.position.y = 50

		return mesh
	}
}