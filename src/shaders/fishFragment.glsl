varying vec2 vUv;

uniform sampler2D uCausticsMap;
uniform float uCausticsScale;

void main()
{
	csm_DiffuseColor += texture2D( uCausticsMap, vUv * uCausticsScale );
	csm_DiffuseColor *= vec4(1.0, 1.0, 2.5, 1.0);
}