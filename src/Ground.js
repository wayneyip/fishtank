import * as THREE from 'three'
import WorldObject from './WorldObject'

export default class Ground extends WorldObject
{
	constructor(resources)
	{
		super(resources)
	}

	initGeometry()
	{
		return new THREE.PlaneGeometry( 300, 300 )
	}

	initMaterial()
	{
		// Textures
		const groundDiffuse = this.resources.items['ground_c']

		let groundNormal = this.resources.items['ground_n']
		groundNormal.wrapS = THREE.RepeatWrapping
		groundNormal.wrapT = THREE.RepeatWrapping
		groundNormal.repeat.set( 4, 4 )

		let groundCaustics = this.resources.items['ground_caustics']
		groundCaustics.wrapS = THREE.RepeatWrapping
		groundCaustics.wrapT = THREE.RepeatWrapping

		// Material
		let material = new THREE.MeshStandardMaterial({
			color: 0xbbbbee,
			map: groundDiffuse,
			normalMap: groundNormal
		})
		const groundUniforms = {
			uCausticsMap: { value: groundCaustics },
			uTime: { value: 0 }
		} 
		material.onBeforeCompile = (shader) =>
		{
			shader.uniforms.uCausticsMap = groundUniforms.uCausticsMap
			shader.uniforms.uTime = groundUniforms.uTime

			shader.fragmentShader = shader.fragmentShader.replace(
				'uniform vec3 diffuse;',
				`
				uniform vec3 diffuse;
				uniform sampler2D uCausticsMap;
				uniform float uTime;
				`
			)
			shader.fragmentShader = shader.fragmentShader.replace(
				'#include <map_fragment>',
				`
				#include <map_fragment>
				diffuseColor += texture2D(uCausticsMap, vMapUv + uTime * 0.01);
				`
			)
			material.userData.shader = shader
		}

		return material
	}

	initMesh()
	{
		let mesh = new THREE.Mesh(this.geometry, this.material)
		mesh.rotateX(-0.5 * Math.PI)
		mesh.position.y -= 15

		return mesh
	}

	update(elapsedTime)
	{
		this.material.userData.shader.uniforms.uTime.value = elapsedTime
	}
}