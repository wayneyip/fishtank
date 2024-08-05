import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import WorldObject from '/utils/WorldObject'
import BoidGroup from '/utils/BoidGroup'
import fishVertexShader from '/shaders/fishVertex.glsl'
import fishFragmentShader from '/shaders/fishFragment.glsl'

const fishWaveAmplitude 	= 5.0
const fishWavelength 		= 0.08
const fishWaveSpeed 		= 15.0
const fishWaveOffset 		= 0.0
const fishTint 				= new THREE.Vector4(1.0, 1.0, 2.5, 1.0)
const fishCausticsScale		= 0.5 
const fishCausticsStrength	= 0.8 

const boidCount 		= 100
const boidScale 		= 0.01
const boidSpawnRange 	= 2

export default class Fish extends WorldObject
{
	constructor()
	{
		super()
	}

	initGeometry()
	{
		const gltf = this.world.resources.items['fish_model']
		const mesh = gltf.scene.children[0]
		const geometry = mesh.geometry 
		
		geometry.rotateX(0.5 * Math.PI)

		return geometry
	}

	initMaterial()
	{
		// Texture
		const fishDiffuse = this.world.resources.items['fish_c']
		const fishCaustics = this.world.resources.items['shared_caustics']

		// Material
		this.uniforms = {
			uAmplitude			: { value: fishWaveAmplitude },
			uWavelength			: { value: fishWavelength },
			uWaveSpeed			: { value: fishWaveSpeed },
			uOffset				: { value: fishWaveOffset },
			uTime				: { value: 0 },
			uTint 				: { value: fishTint },
			uCausticsMap		: { value: fishCaustics },
			uCausticsScale		: { value: fishCausticsScale },
			uCausticsStrength	: { value: fishCausticsStrength },
		}

		const material = new CustomShaderMaterial({
			baseMaterial: THREE.MeshLambertMaterial,
			vertexShader: fishVertexShader,
			fragmentShader: fishFragmentShader,
			silent: true,
			uniforms: this.uniforms,
			map: fishDiffuse
		})

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
		this.uniforms.uTime.value = elapsedTime

		this.boidGroup.simulate(elapsedTime, this.world.pointerRay)
	}
}