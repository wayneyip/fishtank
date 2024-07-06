import glsl from 'vite-plugin-glsl'

export default {
	root: 'src/',
	publicDir: '../static/',
	base: './',
	plugins: 
	[
		glsl()
	]
}