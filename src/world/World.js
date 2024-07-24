import * as THREE from 'three'
import Resources from '/world/Resources'
import sources from '/world/Sources'
import Lighting from '/world/Lighting'
import Skybox from '/world/Skybox'
import Godrays from '/world/Godrays'
import Surface from '/world/Surface'
import Fish from '/world/Fish'
import Ground from '/world/Ground'
import Particles from '/world/Particles'
import GUI from 'lil-gui'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'stats.js'

// Parameters
const guiToggleKey = 'd'
const fogColor = 0x0087bf
const fogStart = 0 
const fogEnd = 150
const cameraFOV = 55
const cameraZPos = 5

export default class World 
{
	constructor(canvas, screenSize)
	{
		// UI
		this.canvas 		= canvas
		this.screenSize 	= screenSize
		this.gui 			= this.initGui()
		this.stats 			= this.initStats()
		
		// Scene 
		this.scene 			= this.initScene()
		this.lighting 		= this.initLighting()
		this.resources 		= new Resources(sources)
		this.worldObjects 	= this.initWorldObjects()
		this.camera 		= this.initCamera()
		this.renderer  		= this.initRenderer()
		this.controls 		= new OrbitControls(this.camera, this.renderer.domElement)
		this.addResizeEvent()

		// Interactivity
		this.raycaster 		= new THREE.Raycaster()
		this.pointerPos 	= new THREE.Vector2()
		this.isPointerDown 	= false
		this.pointerRay 	= null
		this.addPointerEvents()

		// Time
		this.clock 			= this.initClock()
	}

	initGui()
	{
		const gui = new GUI()
		gui.hide()
		window.addEventListener('keydown', (event) =>
		{
			if (event.key == guiToggleKey)
			{
				gui.show(gui._hidden)
			}
		})
		return gui
	}

	initStats()
	{
		const stats = new Stats()
		stats.showPanel(0)
		document.body.appendChild(stats.dom)

		return stats
	}

	initScene()
	{
		const scene = new THREE.Scene()
		scene.fog = new THREE.Fog( fogColor, fogStart, fogEnd )
		scene.background = new THREE.Color( fogColor )

		return scene
	}

	initLighting()
	{
		const lighting = new Lighting()
		this.scene.add(lighting.directionalLight)
		this.scene.add(lighting.ambientLight)
		this.scene.add(lighting.lightTargetMesh)

		return lighting
	}

	initWorldObjects()
	{
		let skybox, surface, fish, ground, particles, godrays
		let worldObjects = []

		this.resources.on('ready', () => {

			// Skybox
			skybox = new Skybox(this.resources)
			this.scene.add(skybox.mesh)
			worldObjects.push(skybox)

			// Water surface
			surface = new Surface(this.resources)
			this.scene.add(surface.mesh)
			worldObjects.push(surface)
			
			// Godrays
			godrays = new Godrays(this.resources)
			this.scene.add(godrays.mesh)
			worldObjects.push(godrays)

			// Fish 
			fish = new Fish(this.resources)
			for (const f of fish.boidGroup.boids)
			{
				this.scene.add(f.mesh)
			}

			// Ground
			ground = new Ground(this.resources)
			this.scene.add(ground.mesh)
			worldObjects.push(ground)

			// Particles
			particles = new Particles(this.resources)
			this.scene.add(particles.mesh)
			worldObjects.push(particles)
		})

		return worldObjects
	}

	initCamera()
	{
		const camera = new THREE.PerspectiveCamera(
			cameraFOV, 
			this.screenSize.width / this.screenSize.height
		)
		camera.position.z = cameraZPos
		camera.rotateX( 0.05 * Math.PI )
		this.scene.add(camera)

		return camera
	}

	initRenderer()
	{
		const renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
			antialias: true
		})
		renderer.shadowMap.enabled = true
		renderer.setSize(this.screenSize.width, this.screenSize.height)
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

		return renderer
	}

	addResizeEvent()
	{
		window.addEventListener('resize', () =>
		{
			this.screenSize.width = window.innerWidth
			this.screenSize.height = window.innerHeight

			camera.aspect = this.screenSize.width / this.screenSize.height
			camera.updateProjectionMatrix()

			renderer.setSize(this.screenSize.width, this.screenSize.height)
		})
	}

	addPointerEvents()
	{
		window.addEventListener('pointerdown', () => {
			this.isPointerDown = true
		})
		window.addEventListener('pointerup', () => {
			this.isPointerDown = false

			// Reset ray, so boids can pass through last touched point
			this.pointerRay = null
		})
		window.addEventListener('pointermove', () => {
			this.pointerPos.x = (event.clientX / window.innerWidth) * 2 - 1
			this.pointerPos.y = -(event.clientY / window.innerHeight) * 2 + 1	
		})
	}

	initClock()
	{
		// Time
		const clock = new THREE.Clock()
		const tick = () => {

			this.stats.begin()

			// Raycasting
			if (this.isPointerDown)
			{
				this.raycaster.setFromCamera(this.pointerPos, this.camera)
				this.pointerRay = this.raycaster.ray 
			}

			// Animation
			const elapsedTime = clock.getElapsedTime()

			for (let worldObject of this.worldObjects)
			{
				if (worldObject)
				{
					worldObject.update(elapsedTime)
				}
			}
			// if (fish)
			// 	fish.update(elapsedTime, this.pointerRay)

			// Render
			this.renderer.render(this.scene, this.camera)

			window.requestAnimationFrame(tick)

			this.stats.end()
		}
		tick()

		return clock
	}
}