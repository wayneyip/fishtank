import glsl from 'vite-plugin-glsl'

export default {
	root: 'src/',
	publicDir: '../static/',
	base: './',
	build:
	{
		outDir: '../dist',
		emptyOutDir: true,
		sourcemap: true
	},
	plugins: 
	[
		glsl()
	]
}