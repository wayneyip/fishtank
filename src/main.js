import * as THREE from 'three'
import World from '/world/World'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Screen size
const screenSize = {
	width: window.innerWidth,
	height: window.innerHeight
}

// World
const world = new World(canvas, screenSize)