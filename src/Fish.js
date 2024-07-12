import * as THREE from 'three'
import WorldObject from './WorldObject'
import {BoidGroup} from './BoidGroup'
import fishVertexShader from './shaders/fishVertex.glsl'
import fishFragmentShader from './shaders/fishFragment.glsl'

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
		let geometry = mesh.geometry 
		
		geometry.rotateX(0.5 * Math.PI)

		return geometry
	}

	initMaterial()
	{
		// Texture
		const fishTexture = this.resources.items['fish_c']

		// Material
		let material = new THREE.ShaderMaterial({
			vertexShader: fishVertexShader,
			fragmentShader: fishFragmentShader,
			uniforms: 
			{
				uAmplitude: { value: 5.0 },
				uWavelength: { value: 0.05 },
				uWaveSpeed: { value: 12.0 },
				uOffset: { value: 0.0 },
				uTime: { value: 0 },
				uMap: { value: fishTexture },
				uTint: { value: new THREE.Vector4(0.7, 0.7, 1.0, 1.0) },
			}
		})

		return material
	}

	initMesh()
	{
		const boidCount = 100
		const boidScale = 0.01
		const spawnRange = 2
		this.boidGroup = new BoidGroup(
			this.geometry, this.material, 
			boidCount, boidScale, spawnRange
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