varying vec2 vUv;

uniform float uAmplitude;
uniform float uWavelength;
uniform float uOffset;
uniform float uWaveSpeed;
uniform float uTime;

void main()
{
	csm_Position.x += uAmplitude * sin(uWavelength * (csm_Position.z + uOffset) + uWaveSpeed * uTime);

	vec4 pos = vec4(csm_Position, 1.0);
	vec4 worldPos = modelMatrix * pos;
	vUv = worldPos.xz;
}