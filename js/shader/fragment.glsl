varying float vNoise;
varying vec2 vUv;
uniform float time;

void main()	{
	vec3 color1 = vec3(1., 0., 0.);
	vec3 color2 = vec3(0., 0., 1.);
	vec3 finalColor = mix(color1, color2, 0.5 * (vNoise + 1.));

	vec2 newUv = vUv;
	newUv = vec2(newUv.x, newUv.y + 0.01 * sin(newUv.x * 10. + time));
	
	gl_FragColor = vec4(finalColor, 1.);
}