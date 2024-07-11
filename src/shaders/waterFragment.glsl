precision mediump float;

uniform vec4 uTopColor;
uniform vec4 uBottomColor;

varying float yPos;

void main()
{
	float yPosSquared = pow(yPos, 2.0);
	gl_FragColor = mix(uBottomColor, uTopColor, yPosSquared);
}