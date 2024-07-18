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
		const repeat = 100
		const normalMap = this.resources.items['ground_n']
		normalMap.wrapS = THREE.RepeatWrapping
		normalMap.wrapT = THREE.RepeatWrapping
		normalMap.repeat.set(repeat, repeat)

		const material = new THREE.MeshPhongMaterial({
			color: 0xccccff,
			specular: 0xffffff,
			shininess: 30,
			normalMap: normalMap
		})	

		return material
	}

	initMesh()
	{
		const mesh = new THREE.Mesh(this.geometry, this.material)
		mesh.rotateX(0.5 * Math.PI)
		mesh.position.y = 30

		return mesh
	}
}