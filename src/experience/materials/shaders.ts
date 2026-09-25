export const gridVert = /* glsl */ `
varying vec3 vWorld;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`

export const gridFrag = /* glsl */ `
varying vec3 vWorld;
uniform vec3 uColor;
uniform float uFade;
uniform float uScale;
void main() {
  vec2 coord = vWorld.xz * uScale;
  vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
  float line = 1.0 - min(min(grid.x, grid.y), 1.0);
  float dist = length(vWorld.xz);
  float alpha = line * smoothstep(uFade, 0.0, dist) * 0.28;
  gl_FragColor = vec4(uColor, alpha);
}
`

export const planetVert = /* glsl */ `
varying vec3 vPos;
varying vec3 vNormal;
void main() {
  vPos = position;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const planetFrag = /* glsl */ `
varying vec3 vPos;
varying vec3 vNormal;
uniform float uTime;
uniform float uSpin;
uniform vec3 uColor;
uniform float uHot;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

void main() {
  vec3 p = vPos;
  float lat = atan(p.z, p.x) + uSpin;
  float lon = p.y;
  vec2 g = vec2(lat, lon) * 4.2;
  float traces = abs(sin(g.x * 6.0) * sin(g.y * 10.0));
  traces = smoothstep(0.18, 0.02, traces);
  float grid = min(abs(fract(g.x * 1.6) - 0.5), abs(fract(g.y * 2.4) - 0.5));
  grid = smoothstep(0.06, 0.012, grid);
  float pads = step(0.82, hash(floor(p * 8.0)));
  float circuit = clamp(traces * 0.7 + grid * 0.9 + pads * 0.35, 0.0, 1.0);
  float pulse = 0.55 + 0.45 * sin(uTime * 2.0 + lat * 4.0);
  vec3 base = vec3(0.02, 0.05, 0.04);
  vec3 glow = uColor * circuit * (0.65 + uHot * 0.8) * pulse;
  float fres = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.2);
  vec3 col = base + glow + uColor * fres * 0.25;
  gl_FragColor = vec4(col, 1.0);
}
`

export const hologramVert = /* glsl */ `
varying vec2 vUv;
varying vec3 vPos;
void main() {
  vUv = uv;
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const hologramFrag = /* glsl */ `
varying vec2 vUv;
varying vec3 vPos;
uniform float uTime;
uniform vec3 uColor;
uniform float uAlpha;
void main() {
  float scan = 0.65 + 0.35 * sin(vUv.y * 70.0 + uTime * 6.0);
  float edge = smoothstep(0.0, 0.08, vUv.y) * smoothstep(1.0, 0.92, vUv.y);
  float ring = smoothstep(0.08, 0.0, abs(fract(vUv.y * 4.0 + uTime * 0.15) - 0.5));
  float a = (0.18 + ring * 0.35) * scan * edge * uAlpha;
  gl_FragColor = vec4(uColor, a);
}
`

export const cityVert = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorld;
void main() {
  vUv = uv;
  #ifdef USE_INSTANCING
    vec4 world = modelMatrix * instanceMatrix * vec4(position, 1.0);
  #else
    vec4 world = modelMatrix * vec4(position, 1.0);
  #endif
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`

export const cityFrag = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorld;
uniform float uTime;
void main() {
  vec2 w = vec2(vUv.x * 8.0, vUv.y * 18.0);
  vec2 cell = fract(w);
  float window = step(0.22, cell.x) * step(cell.x, 0.78) * step(0.18, cell.y) * step(cell.y, 0.82);
  float id = fract(sin(dot(floor(w), vec2(12.9898, 78.233))) * 43758.5453);
  float on = step(0.42, id + 0.06 * sin(uTime * 0.45 + id * 20.0));
  vec3 wall = vec3(0.04, 0.045, 0.05);
  vec3 lit = vec3(0.42, 0.68, 0.82);
  vec3 col = mix(wall, lit, window * on);
  float edge = min(vUv.x, min(1.0 - vUv.x, min(vUv.y, 1.0 - vUv.y)));
  col += vec3(0.18, 0.55, 0.7) * smoothstep(0.04, 0.0, edge) * 0.18;
  gl_FragColor = vec4(col, 1.0);
}
`

export const networkVert = /* glsl */ `
attribute float aT;
varying float vT;
void main() {
  vT = aT;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const networkFrag = /* glsl */ `
varying float vT;
uniform float uTime;
uniform vec3 uColor;
uniform float uAlpha;
void main() {
  float pulse = fract(vT * 2.2 - uTime * 0.11);
  float core = smoothstep(0.0, 0.1, pulse) * smoothstep(0.32, 0.1, pulse);
  float a = (0.14 + core * 0.62) * uAlpha;
  gl_FragColor = vec4(uColor, a);
}
`
