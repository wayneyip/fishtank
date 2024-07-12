import * as THREE from 'three'
import WorldObject from './WorldObject'
import waterVertexShader from './shaders/waterVertex.glsl'
import waterFragmentShader from './shaders/waterFragment.glsl'

export default class Skybox extends WorldObject
{
	constructor(resources)
	{
		super(resources)
	}	

	initGeometry()
	{
		const skySize = 1000
		const geometry = new THREE.SphereGeometry(skySize)

		return geometry
	}

	initMaterial()
	{
		const material = new THREE.ShaderMaterial({
			vertexShader: waterVertexShader,
			fragmentShader: waterFragmentShader,
			side: THREE.BackSide,
			uniforms:
			{
				uTopColor: { value: new THREE.Vector4(1,1,1,1) },
				uBottomColor: { value: new THREE.Vector4(0.007,0.392,0.604,1) }
			}
		})

		return material
	}

	initMesh()
	{
		const mesh = new THREE.Mesh(this.geometry, this.material)

		return mesh
	}
}