import * as THREE from 'three'
import WorldObject from './WorldObject'

const groundSize 				= 300
const groundTint 				= 0xbbbbee
const groundCausticsScrollSpeed = 0.025

export default class Ground extends WorldObject
{
	constructor(resources)
	{
		super(resources)
	}

	initGeometry()
	{
		return new THREE.PlaneGeometry( groundSize, groundSize )
	}

	initMaterial()
	{
		// Textures
		const groundDiffuse = this.resources.items['ground_c']

		const groundNormal = this.resources.items['ground_n']
		groundNormal.wrapS = THREE.RepeatWrapping
		groundNormal.wrapT = THREE.RepeatWrapping

		const groundCaustics = this.resources.items['ground_caustics']
		groundCaustics.wrapS = THREE.RepeatWrapping
		groundCaustics.wrapT = THREE.RepeatWrapping

		// Material
		const material = new THREE.MeshStandardMaterial({
			color 		: groundTint,
			map 		: groundDiffuse,
			normalMap	: groundNormal
		})

		const groundUniforms = {
			uCausticsMap: { value: groundCaustics },
			uTime		: { value: 0 },
			uSpeed 		: { value: groundCausticsScrollSpeed }
		}

		material.onBeforeCompile = (shader) =>
		{
			shader.uniforms.uCausticsMap = groundUniforms.uCausticsMap
			shader.uniforms.uTime = groundUniforms.uTime
			shader.uniforms.uSpeed = groundUniforms.uSpeed

			shader.fragmentShader = shader.fragmentShader.replace(
				'uniform vec3 diffuse;',
				`
				uniform vec3 diffuse;
				uniform sampler2D uCausticsMap;
				uniform float uTime;
				uniform float uSpeed;
				`
			)
			shader.fragmentShader = shader.fragmentShader.replace(
				'#include <map_fragment>',
				`
				#include <map_fragment>
				vec4 noiseSample1 = texture2D(uCausticsMap, 4.0 * vMapUv + uTime * uSpeed);
				vec4 noiseSample2 = texture2D(uCausticsMap, 3.0 * vMapUv - uTime * uSpeed);
				diffuseColor += noiseSample1 + noiseSample2;
				`
			)
			material.userData.shader = shader
		}

		return material
	}

	initMesh()
	{
		const mesh = new THREE.Mesh(this.geometry, this.material)
		mesh.rotateX(-0.5 * Math.PI)
		mesh.position.y -= 15

		return mesh
	}

	update(elapsedTime)
	{
		if (this.material.userData.shader)
		{
			this.material.userData.shader.uniforms.uTime.value = elapsedTime
		}
	}
}