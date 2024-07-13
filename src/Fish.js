import * as THREE from 'three'
import WorldObject from './WorldObject'
import BoidGroup from './BoidGroup'
import fishVertexShader from './shaders/fishVertex.glsl'
import fishFragmentShader from './shaders/fishFragment.glsl'

const fishWaveAmplitude = 5.0
const fishWavelength 	= 0.05
const fishWaveSpeed 	= 12.0
const fishWaveOffset 	= 0.0
const fishTint 			= new THREE.Vector4(0.7, 0.7, 1.0, 1.0)

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
		const fishTexture = this.resources.items['fish_c']

		// Material
		const material = new THREE.ShaderMaterial({
			vertexShader: fishVertexShader,
			fragmentShader: fishFragmentShader,
			uniforms: 
			{
				uAmplitude	: { value: fishWaveAmplitude },
				uWavelength	: { value: fishWavelength },
				uWaveSpeed	: { value: fishWaveSpeed },
				uOffset		: { value: fishWaveOffset },
				uTime		: { value: 0 },
				uMap 		: { value: fishTexture },
				uTint 		: { value: fishTint },
			}
		})

		return material
	}

	initMesh()
	{
		this.boidGroup = new BoidGroup(
			this.geometry, this.material, 
			boidCount, boidScale, boidSpawnRange
		)
	}

	update(elapsedTime)
	{
		for (let boid of this.boidGroup.boids)
		{
			boid.mesh.material.uniforms.uTime.value = elapsedTime
		}
		this.boidGroup.simulate()
	}
}