import * as THREE from 'three'
import WorldObject from './WorldObject'
import BoidGroup from './BoidGroup'
import fishVertexShader from './shaders/fishVertex.glsl'
import fishFragmentShader from './shaders/fishFragment.glsl'

const fishWaveAmplitude = 5.0
const fishWavelength 	= 0.08
const fishWaveSpeed 	= 15.0
const fishWaveOffset 	= 0.0
const fishTint 			= new THREE.Vector4(0.7, 0.7, 1.0, 1.0)
const fishCausticsScale	= 0.5 

const boidCount 		= 100
const boidScale 		= 0.01
const boidSpawnRange 	= 2

export default class Fish extends WorldObject
{
	constructor(resources)
	{
		super(resources)
	}

	initGeometry()
	{
		const gltf = this.resources.items['fish_model']
		const mesh = gltf.scene.children[0]
		const geometry = mesh.geometry 
		
		geometry.rotateX(0.5 * Math.PI)

		return geometry
	}

	initMaterial()
	{
		// Texture
		const fishDiffuse = this.resources.items['fish_c']
		const fishCaustics = this.resources.items['ground_caustics']

		// Material
		const material = new THREE.MeshLambertMaterial({
			map: fishDiffuse,
			color: fishTint
		})

		const uniforms = {
			uAmplitude		: { value: fishWaveAmplitude },
			uWavelength		: { value: fishWavelength },
			uWaveSpeed		: { value: fishWaveSpeed },
			uOffset			: { value: fishWaveOffset },
			uTime			: { value: 0 },
			uCausticsMap	: { value: fishCaustics },
			uCausticsScale	: { value: fishCausticsScale },
		}

		material.onBeforeCompile = (shader) =>
		{
			shader.uniforms.uAmplitude = uniforms.uAmplitude
			shader.uniforms.uWavelength = uniforms.uWavelength
			shader.uniforms.uWaveSpeed = uniforms.uWaveSpeed
			shader.uniforms.uOffset = fishWaveOffset
			shader.uniforms.uTime = uniforms.uTime
			shader.uniforms.uCausticsMap = uniforms.uCausticsMap
			shader.uniforms.uCausticsScale = uniforms.uCausticsScale
			
			// Vertex shader: parameters
			shader.vertexShader = shader.vertexShader.replace(
				'varying vec3 vViewPosition;',
				`
				varying vec3 vViewPosition;
				varying vec2 vUv;

				uniform float uAmplitude;
				uniform float uWavelength;
				uniform float uOffset;
				uniform float uWaveSpeed;
				uniform float uTime;
				`
			)
			// Vertex shader: sine wave animation
			shader.vertexShader = shader.vertexShader.replace(
				'#include <begin_vertex>',
				`
				#include <begin_vertex>
				transformed.x += uAmplitude * sin(uWavelength * (transformed.z + uOffset) + uWaveSpeed * uTime);
				vUv = uv;
				`
			)
			// Vertex shader: save world position to UV
			shader.vertexShader = shader.vertexShader.replace(
				'#include <worldpos_vertex>',
				`
				#include <worldpos_vertex>
				vUv = worldPosition.xz;
				`
			) 
			// Fragment shader: parameters
			shader.fragmentShader = shader.fragmentShader.replace(
				'uniform vec3 diffuse;',
				`
				varying vec2 vUv;
				uniform vec3 diffuse;
				uniform sampler2D uCausticsMap;
				uniform float uCausticsScale;
				`
			)
			// Fragment shader: apply caustics
			shader.fragmentShader = shader.fragmentShader.replace(
				'vec4 diffuseColor = vec4( diffuse, opacity );',
				`
				vec4 diffuseColor = vec4( diffuse, opacity );
				diffuseColor += texture2D( uCausticsMap, vUv * uCausticsScale );
				diffuseColor *= vec4(1.0, 1.0, 2.5, 1.0);
				`
			) 

			material.userData.shader = shader
		}

		return material
	}

	initMesh()
	{
		this.meshes = []

		for (let i=0; i < boidCount; i++)
		{
			const mesh = new THREE.Mesh(this.geometry, this.material)	
			mesh.castShadow = true
			mesh.receiveShadow = true
			this.meshes.push(mesh)
		}

		this.boidGroup = new BoidGroup(
			this.meshes, boidScale, boidSpawnRange
		)
	}

	update(elapsedTime)
	{
		this.boidGroup.simulate(elapsedTime)
	}
}