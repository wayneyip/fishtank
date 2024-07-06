uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

uniform float uFrequency;
uniform float uTime;

attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;

void main()
{
	vec4 warpedPosition = vec4(position, 1.0);

	warpedPosition.x += 80.0 * sin(0.005 * warpedPosition.z + 10.0 * uTime);

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * warpedPosition;

	vUv = uv;
}