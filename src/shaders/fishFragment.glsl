precision mediump float;

uniform sampler2D uMap;
uniform sampler2D uAlpha;

varying vec2 vUv;

void main()
{
	vec4 textureColor = texture2D(uMap, vUv);
	float alpha = texture2D(uAlpha, vUv).r;

	gl_FragColor = textureColor;
	gl_FragColor.a = alpha;
}