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

// Parameters
const guiToggleKey = 'd'
const fogColor = 0x0087bf
const fogStart = 0 
const fogEnd = 150
const cameraFOV = 55
const cameraZPos = 5

export default class World 
{
	constructor()
	{
		this.gui = this.initGui()
		// this.scene = initScene()
		// this.lighting = initLighting()
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

	initScene()
	{
		const scene = new THREE.Scene()
		scene.fog = new THREE.Fog( fogColor, fogStart, fogEnd )
		scene.background = new THREE.Color( fogColor )
	}

	initLighting()
	{
		const lighting = new Lighting()
		scene.add(lighting.directionalLight)
		scene.add(lighting.ambientLight)
		scene.add(lighting.lightTargetMesh)
	}
}