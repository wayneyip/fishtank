import * as THREE from 'three'
import WorldObject from './WorldObject'
import godraysVertexShader from './shaders/godraysVertex.glsl'
import godraysFragmentShader from './shaders/godraysFragment.glsl'

export default class Godrays extends WorldObject
{
	constructor(resources)
	{
		super(resources)
	}

	initGeometry()
	{
		const geometry = new THREE.ConeGeometry(
			5, 		// radius
			5,		// height
			32, 	// radialSegments
			6,		// heightSegments
			true	// openEnded
		) 
		return geometry
	}

	initMaterial()
	{
		// Texture
		const noise = this.resources.items['ground_caustics']

		// Material
		// const material = new THREE.MeshLambertMaterial({
		// 	map: noise,
		// 	side: THREE.DoubleSide
		// })
		const material = new THREE.ShaderMaterial({
			vertexShader: godraysVertexShader,
			fragmentShader: godraysFragmentShader,
			side: THREE.DoubleSide,
			// transparent: true,
			uniforms: {
				uMap: { value: noise },
				uTint: { value: new THREE.Vector4(1.0,1.0,0.0,1.0) }
			}
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