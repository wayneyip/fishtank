import * as THREE from 'three'

export default class Lighting
{
	constructor()
	{
		this.directionalLight = this.initDirectionalLight()
		this.ambientLight = this.initAmbientLight()
		this.lightTargetMesh = this.initLightTarget()
	}

	initDirectionalLight()
	{
		const dirLight = new THREE.DirectionalLight()
		dirLight.castShadow = true
		dirLight.intensity = 1.5
		dirLight.position.y = 0
		
		return dirLight
	}

	initAmbientLight()
	{
		const ambientLight = new THREE.AmbientLight()
		ambientLight.intensity = 1.0

		return ambientLight
	}

	initLightTarget()
	{

		const lightTargetGeo = new THREE.PlaneGeometry(1,1)
		const lightTargetMat = new THREE.MeshBasicMaterial()
		const lightTargetMesh = new THREE.Mesh(lightTargetGeo, lightTargetMat)
		lightTargetMesh.position.y = -10

		this.directionalLight.target = lightTargetMesh

		return lightTargetMesh
	}
}