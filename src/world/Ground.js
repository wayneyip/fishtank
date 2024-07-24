import * as THREE from 'three'
import WorldObject from '/utils/WorldObject'

const groundSize 				= 300
const groundTint 				= 0xccccff
const groundCausticsScrollSpeed = 0.04
const groundCausticsTint		= new THREE.Vector4(0.5, 0.5, 0.6, 1.0)

export default class Ground extends WorldObject
{
	constructor()
	{
		super()
	}

	initGeometry()
	{
		return new THREE.PlaneGeometry( groundSize, groundSize )
	}

	initMaterial()
	{
		// Textures
		const groundDiffuse = this.world.resources.items['ground_c']
		groundDiffuse.wrapS = THREE.RepeatWrapping
		groundDiffuse.wrapT = THREE.RepeatWrapping

		const groundNormal = this.world.resources.items['ground_n']
		groundNormal.wrapS = THREE.RepeatWrapping
		groundNormal.wrapT = THREE.RepeatWrapping

		const groundCaustics = this.world.resources.items['shared_caustics']
		groundCaustics.wrapS = THREE.RepeatWrapping
		groundCaustics.wrapT = THREE.RepeatWrapping

		// Material
		const material = new THREE.MeshLambertMaterial({
			color 		: groundTint,
			map 		: groundDiffuse,
			normalMap	: groundNormal
		})

		const groundUniforms = {
			uCausticsMap	: { value: groundCaustics },
			uCausticsTint	: { value: groundCausticsTint }, 
			uTime			: { value: 0 },
			uSpeed 			: { value: groundCausticsScrollSpeed },
		}

		material.onBeforeCompile = (shader) =>
		{
			shader.uniforms.uCausticsMap = groundUniforms.uCausticsMap
			shader.uniforms.uCausticsTint = groundUniforms.uCausticsTint
			shader.uniforms.uTime = groundUniforms.uTime
			shader.uniforms.uSpeed = groundUniforms.uSpeed

			shader.fragmentShader = shader.fragmentShader.replace(
				'uniform vec3 diffuse;',
				`
				uniform vec3 diffuse;
				uniform sampler2D uCausticsMap;
				uniform vec4 uCausticsTint;
				uniform float uTime;
				uniform float uSpeed;
				`
			)
			shader.fragmentShader = shader.fragmentShader.replace(
				'#include <map_fragment>',
				`
				#include <map_fragment>
				vec4 noiseSample1 = texture2D(uCausticsMap, 8.0 * vMapUv + uTime * uSpeed);
				vec4 noiseSample2 = texture2D(uCausticsMap, 6.0 * vMapUv - uTime * uSpeed);
				diffuseColor += uCausticsTint * (noiseSample1 * noiseSample2);
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