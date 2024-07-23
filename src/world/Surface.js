import * as THREE from 'three'
import WorldObject from './WorldObject'

const surfaceSize 			= 1000
const surfaceNormalsRepeat 	= 10
const surfaceColor 			= 0xffffff
const surfaceSpecular 		= 0xffffff
const surfaceShininess 		= 50
const surfaceScrollSpeed 	= 0.02

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
		const normalMap = this.resources.items['surface_n']
		normalMap.wrapS = THREE.RepeatWrapping
		normalMap.wrapT = THREE.RepeatWrapping
		normalMap.repeat.set(surfaceNormalsRepeat, surfaceNormalsRepeat)

		const material = new THREE.MeshPhongMaterial({
			color: surfaceColor,
			specular: surfaceSpecular,
			shininess: surfaceShininess,
			normalMap: normalMap
		})

		const surfaceUniforms = {
			uTime : { value: 0.0 },
			uSpeed: { value: surfaceScrollSpeed }
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
				vec3 n2 = -normalize( tbn * mapN2 );

				normal = -normalize(vec3(n1.xy + n2.xy, n1.b * n2.b)); 
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
		mesh.position.y = 50

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