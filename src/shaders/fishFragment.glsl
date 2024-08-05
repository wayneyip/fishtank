varying vec2 vUv;

uniform sampler2D uCausticsMap;
uniform float uCausticsScale;
uniform float uCausticsStrength;
uniform vec4 uTint;

void main()
{
	csm_DiffuseColor += uCausticsStrength * texture2D( uCausticsMap, vUv * uCausticsScale );
	csm_DiffuseColor *= uTint;
}