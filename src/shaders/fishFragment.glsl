precision mediump float;

uniform sampler2D uMap;
uniform vec4 uTint;

varying vec2 vUv;

void main()
{
	vec4 textureColor = texture2D(uMap, vUv);

	gl_FragColor = textureColor * uTint;
}