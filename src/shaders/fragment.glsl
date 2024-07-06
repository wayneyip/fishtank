precision mediump float;

uniform sampler2D uMap;
uniform sampler2D uAlpha;

varying vec2 vUv;

void main()
{
	vec4 textureColor = texture2D(uMap, vUv);
	vec4 alpha = texture2D(uAlpha, vUv);
	
	gl_FragColor = textureColor;
}