uniform sampler2D uPositions;
uniform sampler2D uVelocities;
uniform float uSize;
attribute vec2 aRef;
varying float vSpeed;
varying float vSeed;
void main() {
  vec4 p = texture2D(uPositions, aRef);
  vec3 v = texture2D(uVelocities, aRef).xyz;
  vSpeed = clamp(length(v) / 600.0, 0.0, 1.0);
  vSeed = p.w;
  vec4 mv = modelViewMatrix * vec4(p.xyz, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.75 + 0.5 * p.w) * (1.0 + vSpeed * 0.6);
}
