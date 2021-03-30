varying vec2 vUv;
uniform float time;
uniform sampler2D uImage;

void main()	{
	vec2 newUv = vUv;
	vec4 uImageView = texture2D(uImage, newUv);
	gl_FragColor = uImageView;
}