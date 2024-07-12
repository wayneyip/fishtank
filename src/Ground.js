import * as THREE from 'three'

export default class Ground 
{
	constructor(resources)
	{
		// Geometry
		this.geometry = new THREE.PlaneGeometry( 300, 300 )

		// Textures
		const groundDiffuse = resources.items['ground_c']
		var groundNormal = resources.items['ground_n']
		groundNormal.wrapS = THREE.RepeatWrapping
		groundNormal.wrapT = THREE.RepeatWrapping
		groundNormal.repeat.set( 4, 4 )
		var groundCaustics = resources.items['ground_caustics']
		groundCaustics.wrapS = THREE.RepeatWrapping
		groundCaustics.wrapT = THREE.RepeatWrapping

		// Material
		this.material = new THREE.MeshStandardMaterial({
			color: 0xbbbbee,
			map: groundDiffuse,
			normalMap: groundNormal
		})
		const groundUniforms = {
			uCausticsMap: { value: groundCaustics },
			uTime: { value: 0 }
		} 
		this.material.onBeforeCompile = (shader) =>
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
			this.material.userData.shader = shader
		}

		// Mesh
		this.mesh = new THREE.Mesh(this.geometry, this.material)
		this.mesh.rotateX(-0.5 * Math.PI)
		this.mesh.position.y -= 15
	}

	update(elapsedTime)
	{
		if (this.material.userData.shader)
		{
			this.material.userData.shader.uniforms.uTime.value = elapsedTime
		}
	}
}