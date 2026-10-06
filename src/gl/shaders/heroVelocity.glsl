// Each particle is a parameter vector θ descending L(θ) = ½‖θ − θ*‖², θ* a point on a glyph.
// Heavy-ball SGD:  v ← βv − η∇L + σ(t)·ξ,   θ ← θ + v
// σ(t) is an annealed temperature (curl noise keeps the "noise" swirly instead of jittery).
uniform float uTime;
uniform float uDelta;
uniform float uProgress;   // 0 → 1 training schedule
uniform float uScatter;    // scroll-driven: un-train back into the flow field
uniform vec2  uMouse;      // view-space px
uniform float uMouseForce;
uniform sampler2D uTarget;
uniform vec2  uBounds;     // half-extents of the hero band (px): particles live inside it

#include "./lib/noise.glsl"

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 p = texture2D(texturePosition, uv).xyz;
  vec3 v = texture2D(textureVelocity, uv).xyz;
  vec3 t = texture2D(uTarget, uv).xyz;

  float prog = uProgress;
  float lr = mix(2.0, 14.0, prog) * (1.0 - uScatter);           // learning-rate warm-up
  vec3 grad = p - t;                                              // ∇L
  float temp = mix(180.0, 4.0, prog) + uScatter * 420.0;         // annealing

  vec3 force = -lr * grad + curlNoise(vec3(p.xy * 0.0035, uTime * 0.08 + uv.x)) * temp;

  vec2 d = p.xy - uMouse;
  float r2 = dot(d, d);
  force.xy += uMouseForce * normalize(d + 1e-4) * 9000.0 * exp(-r2 / (2.0 * 90.0 * 90.0));

  // Soft walls: a stiff spring pulls anything past the band's edge back in (and kills
  // its outward velocity), so even the scroll "un-training" stays inside the band.
  vec2 over = max(abs(p.xy) - uBounds, 0.0) * sign(p.xy);
  force.xy -= over * 60.0;
  v.xy *= mix(vec2(1.0), vec2(0.6), step(vec2(0.0), over * sign(v.xy)) * step(vec2(0.001), abs(over)));
  force.z -= p.z * 4.0;

  v += force * uDelta;
  v *= pow(0.012, uDelta);                                        // momentum, near-critical damping
  gl_FragColor = vec4(v, 1.0);
}
