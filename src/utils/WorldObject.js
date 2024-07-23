export default class WorldObject
{
	constructor(resources)
	{
		this.resources = resources
		this.geometry = this.initGeometry()
		this.material = this.initMaterial()
		this.mesh = this.initMesh()
	}

	initGeometry()
	{
		return null
	}

	initMaterial()
	{
		return null
	}

	initMesh()
	{
		return null
	}

	update(elapsedTime)
	{
		
	}
}
