import * as THREE from 'three'
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Lighting

// Geometry
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
camera.position.z = 10;
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

	// Update objects
	mesh.position.y = Math.sin(elapsedTime)

	// Render
	renderer.render(scene, camera)

	window.requestAnimationFrame(tick)
}
tick()