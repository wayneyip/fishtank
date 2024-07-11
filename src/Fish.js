import * as THREE from 'three'
import {BoidGroup} from './BoidGroup'
import fishVertexShader from './shaders/fishVertex.glsl'
import fishFragmentShader from './shaders/fishFragment.glsl'

export default class Fish
{
	constructor(resources)
	{
		this.boidGroup = null
		const fishTexture = resources.loaders.textureLoader.load('fish/fish_c.png')
		fishTexture.flipY = false
		var material = null

		resources.loaders.gltfLoader.load(
			'fish/fish.gltf',
			(gltf) =>
			{
				const mesh = gltf.scene.children[0]

				const geometry = mesh.geometry 
				geometry.rotateX(0.5 * Math.PI)
				
				material = new THREE.ShaderMaterial({
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

				// Boids 
				const boidCount = 100
				const boidScale = 0.01
				const spawnRange = 2
				this.boidGroup = new BoidGroup(
					geometry, material, 
					boidCount, boidScale, spawnRange
				)
			}
		)
	}

	update(elapsedTime)
	{
		if (this.boidGroup)
		{
			for (let boid of this.boidGroup.boids)
			{
				boid.mesh.material.uniforms.uTime.value = elapsedTime
			}
			boidGroup.simulate()
		}
	}
}