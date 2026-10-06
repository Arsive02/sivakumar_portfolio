uniform vec3 uInk;
uniform vec3 uAccent;
uniform float uOpacity;
varying float vSpeed;
varying float vSeed;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.15, d);
  // Fast (still-learning) particles glow in the accent; converged ones settle into ink.
  vec3 col = mix(uInk, uAccent, smoothstep(0.08, 0.6, vSpeed) + step(0.985, vSeed));
  gl_FragColor = vec4(col, a * uOpacity);
}
