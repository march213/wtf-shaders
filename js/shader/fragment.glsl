varying float vNoise;
varying vec2 vUv;
uniform sampler2D oceanTexture;

uniform float time;

void main()	{
	// vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
	// gl_FragColor = vec4(vUv,0.0,1.);

	vec3 color1 = vec3(1., 0., 0.);
	vec3 color2 = vec3(0., 0., 1.);
	// vec3 finalColor = mix(color1, color2, vNoise + 0.5);
	vec3 finalColor = mix(color1, color2, 0.5 * (vNoise + 1.));

	vec2 newUv = vUv;
	newUv = vec2(newUv.x, newUv.y + 0.01 * sin(newUv.x * 10. + time));
	vec4 oceanView = texture2D(oceanTexture, newUv);
	
	gl_FragColor = vec4(finalColor, 1.);
	gl_FragColor = vec4(vUv, 0., 1.);
	gl_FragColor = oceanView;
}