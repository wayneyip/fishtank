import * as THREE from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js'
import EventEmitter from './EventEmitter'

const sources = [
	{
		name: 'fish_model',
		type: 'gltfModel',
		path: 'fish/fish.gltf'
	},
	{
		name: 'fish_c',
		type: 'texture',
		path: 'fish/fish_c.png'
	},
	{
		name: 'ground_c',
		type: 'texture',
		path: 'ground/ground_c.png'
	},
	{
		name: 'ground_n',
		type: 'texture',
		path: 'ground/ground_n.png'
	},
	{
		name: 'ground_caustics',
		type: 'texture',
		path: 'ground/ground_caustics.png'
	},
	{
		name: 'particles_a',
		type: 'texture',
		path: 'particles/particles_a.png'
	},
]

export default class Resources extends EventEmitter
{
	constructor()
	{
		super()

		this.items = {}
		this.toLoad = sources.length
		this.loaded = 0

		this.setLoaders()
		this.startLoading()
	}

	setLoaders()
	{
		this.loaders = {}
		
		// glTF
		this.loaders.gltfLoader = new GLTFLoader() 

		// DRACO
		this.loaders.dracoLoader = new DRACOLoader()
		this.loaders.dracoLoader.setDecoderPath('/draco/')
		this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader)
		
		// Texture
		this.loaders.textureLoader = new THREE.TextureLoader()
	}

	startLoading()
	{
		for (let source of sources)
		{
			if (source.type == 'gltfModel')
			{
				this.loaders.gltfLoader.load(
					source.path,
					(file) =>
					{
						this.sourceLoaded(source, file)
					}
				)
			}
			else if (source.type == 'texture')
			{
				this.loaders.textureLoader.load(
					source.path,
					(file) =>
					{
						file.flipY = false
						this.sourceLoaded(source, file)
					}
				)
			}
		}
	}

	sourceLoaded(source, file)
	{
		this.items[source.name] = file
		
		console.log("Loaded: " + source.name)

		this.loaded++

		if (this.isFinishedLoading())
		{
			this.trigger('ready')
		}
	}

	isFinishedLoading()
	{
		return (this.loaded === this.toLoad) 
	}
}

