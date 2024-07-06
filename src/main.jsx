import * as THREE from 'three'
import {BoidGroup} from './BoidGroup'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js'
import testVertexShader from './shaders/vertex.glsl'
import testFragmentShader from './shaders/fragment.glsl'

const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Lighting
const dirLight = new THREE.DirectionalLight()
scene.add(dirLight)
const ambLight = new THREE.AmbientLight()
scene.add(ambLight)

// Geometry
// const geometry = new THREE.ConeGeometry(1, 2)
// geometry.rotateX(0.5 * Math.PI)
// const material = new THREE.MeshLambertMaterial({ color: 0xaaaaaa })

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
		material = new THREE.RawShaderMaterial({
			vertexShader: testVertexShader,
			fragmentShader: testFragmentShader,
			uniforms: 
			{
				uFrequency: { value: 100 },
				uTime: { value: 0 },
				uMap: { value: fishTexture },
				uAlpha: { value: fishAlpha }
			}
		})
		
		// Boids 
		const boidCount = 100
		const boidScale = .001 //0.001
		const spawnRange = 2
		boidGroup = new BoidGroup(
			scene, geometry, material, 
			boidCount, boidScale, spawnRange
		)
	}
)


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

const clock = new THREE.Clock()

// Animations
const tick = () => {

	const elapsedTime = clock.getElapsedTime()

	if (material)
	{
		material.uniforms.uTime.value = elapsedTime
		// console.log(material.uniforms.uTime.value)
	}

	if (boidGroup)
	{
		boidGroup.simulate()
	}

	// Render
	renderer.render(scene, camera)

	window.requestAnimationFrame(tick)
}
tick()