import * as THREE from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js'

export default class Resources
{
	constructor()
	{
		this.loaders = {}
		
		this.loaders.gltfLoader = new GLTFLoader() 

		this.loaders.dracoLoader = new DRACOLoader()
		this.loaders.dracoLoader.setDecoderPath('/draco/')
		this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader)
		
		this.loaders.textureLoader = new THREE.TextureLoader()
	}
}