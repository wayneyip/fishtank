import * as THREE from 'three'
import WorldObject from '/utils/WorldObject'
import waterVertexShader from '/shaders/waterVertex.glsl'
import waterFragmentShader from '/shaders/waterFragment.glsl'

const skySize 			= 1000
const skyTopColor 		= new THREE.Vector4(1, 1, 1, 1)
const skyBottomColor 	= new THREE.Vector4(0.00, 0.530, 0.750, 1)


export default class Skybox extends WorldObject
{
	constructor(resources)
	{
		super(resources)
	}	

	initGeometry()
	{
		const geometry = new THREE.SphereGeometry(skySize)

		return geometry
	}

	initMaterial()
	{
		const material = new THREE.ShaderMaterial({
			vertexShader 	: waterVertexShader,
			fragmentShader  : waterFragmentShader,
			side 			: THREE.BackSide,
			uniforms 		:
			{
				uTopColor 	: { value: skyTopColor },
				uBottomColor: { value: skyBottomColor }
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