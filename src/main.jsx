import * as THREE from 'three'
import {BoidGroup} from './BoidGroup'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js'
import fishVertexShader from './shaders/fishVertex.glsl'
import fishFragmentShader from './shaders/fishFragment.glsl'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Lighting
const dirLight = new THREE.DirectionalLight()
scene.add(dirLight)

// Boids
var boidGroup = null

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

const textureLoader = new THREE.TextureLoader()
const fishTexture = textureLoader.load('fish_c.png')
const fishAlpha = textureLoader.load('fish_a.png')
fishTexture.flipY = false
fishAlpha.flipY = false
var material = null

gltfLoader.load(
	'/fish.gltf',
	(gltf) =>
	{
		const mesh = gltf.scene.children[0]
		const geometry = mesh.geometry 
		geometry.rotateY(0.5 * Math.PI)
		material = new THREE.ShaderMaterial({
			vertexShader: fishVertexShader,
			fragmentShader: fishFragmentShader,
			side: THREE.DoubleSide,
			transparent: true,
			uniforms: 
			{
				uAmplitude: { value: 70.0 },
				uWavelength: { value: 0.004 },
				uWaveSpeed: { value: 12.0 },
				uOffset: { value: 0.0 },
				uTime: { value: 0 },
				uMap: { value: fishTexture },
				uAlpha: { value: fishAlpha }
			}
		})

		// Boids 
		const boidCount = 100
		const boidScale = 0.001
		const spawnRange = 2
		boidGroup = new BoidGroup(
			scene, geometry, material, 
			boidCount, boidScale, spawnRange
		)
	}
)

// Fog 
scene.fog = new THREE.Fog( 0x02649a, 50, 150 )
scene.background = new THREE.Color( 0x02649a )

// Ground
const groundGeo = new THREE.PlaneGeometry( 300, 300 )
const groundDiffuse = textureLoader.load('ground/ground_c.png')
var groundNormal = textureLoader.load('ground/ground_n.png')
groundNormal.wrapS = THREE.RepeatWrapping
groundNormal.wrapT = THREE.RepeatWrapping
groundNormal.repeat.set( 4, 4 )
var groundCaustics = textureLoader.load('ground/ground_caustics.png')
groundCaustics.wrapS = THREE.RepeatWrapping
groundCaustics.wrapT = THREE.RepeatWrapping
const groundMat = new THREE.MeshStandardMaterial({
	map: groundDiffuse,
	normalMap: groundNormal
})
const groundUniforms = {
	uCausticsMap: { value: groundCaustics },
	uTime: { value: 0 }
} 
groundMat.onBeforeCompile = (shader) =>
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
	groundMat.userData.shader = shader
}
const groundMesh = new THREE.Mesh(groundGeo, groundMat)
groundMesh.rotateX(-0.5 * Math.PI)
groundMesh.position.y -= 15
scene.add(groundMesh)
dirLight.position.y = 3
dirLight.position.z = 10
dirLight.target = groundMesh

// Screen size
const size = {
	width: window.innerWidth,
	height: window.innerHeight
}
window.addEventListener('resize', () =>
{
	size.width = window.innerWidth
	size.height = window.innerHeight

	camera.aspect = size.width / size.height
	camera.updateProjectionMatrix()

	renderer.setSize(size.width, size.height)
})

// Camera
const camera = new THREE.PerspectiveCamera(45, size.width/size.height)
camera.position.z = 10
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
})
renderer.setSize(size.width, size.height)

const controls = new OrbitControls( camera, renderer.domElement );

const clock = new THREE.Clock()

// Animations
const tick = () => {

	const elapsedTime = clock.getElapsedTime()

	if (boidGroup)
	{
		for (let boid of boidGroup.boids)
		{
			boid.mesh.material.uniforms.uTime.value = elapsedTime
		}
		boidGroup.simulate()
	}
	if (groundMat.userData.shader)
	{
		groundMat.userData.shader.uniforms.uTime.value = elapsedTime
	}

	// Render
	renderer.render(scene, camera)

	window.requestAnimationFrame(tick)
}
tick()