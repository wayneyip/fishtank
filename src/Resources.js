import * as THREE from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js'
import EventEmitter from './EventEmitter'

export default class Resources extends EventEmitter
{
	constructor(sources)
	{
		super()

		this.sources = sources

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
		for (let source of this.sources)
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
			console.log("Ready: all resources loaded!")
			this.trigger('ready')
		}
	}

	isFinishedLoading()
	{
		return (this.loaded === this.toLoad) 
	}
}

