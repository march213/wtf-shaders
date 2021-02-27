// varying vec2 vUv;
varying float vNoise;

void main()	{
	// vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
	// gl_FragColor = vec4(vUv,0.0,1.);

	vec3 color1 = vec3(1., 0., 0.);
	vec3 color2 = vec3(0., 0., 1.);
	// vec3 finalColor = mix(color1, color2, vNoise + 0.5);
	vec3 finalColor = mix(color1, color2, 0.5 * (vNoise + 1.));
	gl_FragColor = vec4(finalColor, 1.);
}