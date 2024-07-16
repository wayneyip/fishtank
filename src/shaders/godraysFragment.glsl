precision mediump float;

uniform sampler2D uMap;
uniform vec4 uTint;
uniform float uRadialScale;
uniform float uLengthScale;
uniform float uTime;
uniform float uSpeed;

varying vec2 vUv;
varying vec3 vPos;

void main()
{
	// Polar coordinate texture sampling
	vec2 center = vec2(0.5, 0.5);

	vec2 delta = vUv - center;
	float radius = length(delta) * 2.0 * uRadialScale;
	float angle = atan(delta.x, delta.y) * 1.0/6.28 * uLengthScale;
	
	vec2 polarUv = vec2(radius, angle);
	polarUv.x = polarUv.x + uTime * uSpeed;

	vec4 radialNoise = texture2D(uMap, polarUv);
	float radialAlpha = dot(radialNoise.xyz, vec3(0.3, 0.59, 0.11)); // brightness

	// Vertical fade
	float verticalFade = mix(1.0, 0.0, vPos.z);

	float alpha = radialAlpha * verticalFade;

	gl_FragColor = vec4(uTint.xyz, alpha);
}