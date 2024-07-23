import * as THREE from 'three'
import WorldObject from '/utils/WorldObject'
import godraysVertexShader from '/shaders/godraysVertex.glsl'
import godraysFragmentShader from '/shaders/godraysFragment.glsl'

const godrayTint 		= new THREE.Vector4(0.9, 0.9, 1.0, 1.0)
const godrayRadialScale = -0.02
const godrayLengthScale = 5.58
const godraySpeed 		= 0.10
const godrayIntensity 	= 0.06

export default class Godrays extends WorldObject
{
	constructor(resources, gui)
	{
		super(resources)
	}

	initGeometry()
	{
		const gltf = this.resources.items['godrays_model']
		const mesh = gltf.scene.children[0]
		const geometry = mesh.geometry

		return geometry
	}

	initMaterial()
	{
		// Texture
		const noise = this.resources.items['shared_caustics']

		const material = new THREE.ShaderMaterial({
			vertexShader: godraysVertexShader,
			fragmentShader: godraysFragmentShader,
			side: THREE.DoubleSide,
			transparent: true,
			uniforms: {
				uMap 		: { value: noise },
				uTint 		: { value: godrayTint },
				uRadialScale: { value: godrayRadialScale },
				uLengthScale: { value: godrayLengthScale },
				uTime 		: { value: 0 },
				uSpeed 		: { value: godraySpeed },
				uIntensity	: { value: godrayIntensity }
			}
		})
		return material
	}

	initMesh()
	{
		const mesh = new THREE.Mesh(this.geometry, this.material)

		mesh.rotateX(0.5 * Math.PI)
		mesh.rotateZ(1.0 * Math.PI)
		
		mesh.position.y = 2

		return mesh
	}

	update(elapsedTime)
	{
		this.material.uniforms.uTime.value = elapsedTime
	}
}