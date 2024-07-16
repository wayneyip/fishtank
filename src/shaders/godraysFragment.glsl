precision mediump float;

uniform sampler2D uMap;
uniform vec4 uTint;
uniform float uRadialScale;
uniform float uLengthScale;

varying vec2 vUv;

void main()
{
	vec2 center = vec2(0.5, 0.5);

	vec2 delta = vUv - center;
	float radius = length(delta) * 2.0 * uRadialScale;
	float angle = atan(delta.x, delta.y) * 1.0/6.28 * uLengthScale;
	
	vec2 polarUv = vec2(radius, angle);

	vec4 noise = texture2D(uMap, polarUv);

	gl_FragColor = noise * uTint;
}