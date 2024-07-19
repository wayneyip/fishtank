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
		const repeat = 20
		const normalMap = this.resources.items['surface_n']
		normalMap.wrapS = THREE.RepeatWrapping
		normalMap.wrapT = THREE.RepeatWrapping
		normalMap.repeat.set(repeat, repeat)

		const material = new THREE.MeshPhongMaterial({
			color: 0x02649a,
			specular: 0xddddff,
			shininess: 5,
			normalMap: normalMap
		})

		const surfaceUniforms = {
			uTime : { value: 0.0 },
			uSpeed: { value: 0.04 }
		}	

		material.onBeforeCompile = (shader) =>
		{
			shader.uniforms.uTime = surfaceUniforms.uTime
			shader.uniforms.uSpeed = surfaceUniforms.uSpeed

			shader.fragmentShader = shader.fragmentShader.replace(
				'uniform vec3 diffuse;',
				`
				uniform vec3 diffuse;
				uniform float uTime;
				uniform float uSpeed;
				`
			)

			shader.fragmentShader = shader.fragmentShader.replace(
				'#include <normal_fragment_maps>',
				`
				vec3 mapN1 = texture2D( normalMap, vNormalMapUv + uTime * uSpeed ).xyz * 2.0 - 1.0;
				mapN1.xy *= normalScale;
				vec3 n1 = normalize( tbn * mapN1 );

				vec3 mapN2 = texture2D( normalMap, vNormalMapUv - uTime * uSpeed ).xyz * 2.0 - 1.0;
				mapN2.xy *= normalScale;
				vec3 n2 = normalize( tbn * mapN2 );

				normal = - normalize(n1 + n2); 
				`
			)
			material.userData.shader = shader
		}
		return material
	}

	initMesh()
	{
		const mesh = new THREE.Mesh(this.geometry, this.material)
		mesh.rotateX(0.5 * Math.PI)
		mesh.position.y = 30

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