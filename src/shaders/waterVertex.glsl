varying float yPos;

void main()
{
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

	yPos = normalize(position).y;
}