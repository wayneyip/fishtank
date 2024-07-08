uniform float uAmplitude;
uniform float uWavelength;
uniform float uOffset;
uniform float uWaveSpeed;
uniform float uTime;

varying vec2 vUv;

void main()
{
	vec4 warpedPosition = vec4(position, 1.0);

	warpedPosition.x += uAmplitude * sin(uWavelength * (warpedPosition.z + uOffset) + uWaveSpeed * uTime);

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * warpedPosition;

	vUv = uv;
}