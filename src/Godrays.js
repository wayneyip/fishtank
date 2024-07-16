import * as THREE from 'three'
import WorldObject from './WorldObject'
import godraysVertexShader from './shaders/godraysVertex.glsl'
import godraysFragmentShader from './shaders/godraysFragment.glsl'

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
		const noise = this.resources.items['ground_caustics']

		const material = new THREE.ShaderMaterial({
			vertexShader: godraysVertexShader,
			fragmentShader: godraysFragmentShader,
			side: THREE.DoubleSide,
			transparent: true,
			uniforms: {
				uMap: { value: noise },
				uTint: { value: new THREE.Vector4(.8,.8,.75,1.0) },
				uRadialScale: { value: -0.02 },
				uLengthScale: { value: 2.58 },
				uTime: { value: 0 },
				uSpeed: { value: 0.05 }
			}
		})
		return material
	}

	initMesh()
	{
		const mesh = new THREE.Mesh(this.geometry, this.material)
		
		mesh.scale.x = 0.3
		mesh.scale.y = 0.3
		mesh.scale.z = 0.3

		mesh.rotateX(0.5 * Math.PI)
		mesh.rotateZ(1.0 * Math.PI)
		
		mesh.position.y = 4

		return mesh
	}

	update(elapsedTime)
	{
		this.material.uniforms.uTime.value = elapsedTime
	}
}