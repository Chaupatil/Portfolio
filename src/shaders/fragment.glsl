uniform float uTime;
uniform float uHover;
varying vec2 vUv;

void main() {
  float glow = sin(uTime * 3.0 + vUv.x * 10.0) * 0.5 + 0.5;
  vec3 color = mix(vec3(0.3, 0.0, 0.6), vec3(1.0, 0.6, 1.0), glow);
  color *= mix(1.0, 1.5, uHover);
  gl_FragColor = vec4(color, 1.0);
}
