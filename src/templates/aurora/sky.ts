import { fitCanvas, rafLoop } from '~/lib/canvas';
import { prefersReducedMotion } from '~/lib/motion';
import { tokenVec3 } from '~/lib/tokens';

const VERTEX = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAGMENT = `
precision highp float;
uniform vec2 uRes;uniform float uT;
uniform vec3 uSkyLow;uniform vec3 uSkyHigh;uniform vec3 uStar;
uniform vec3 uCurtain;uniform vec3 uCurtainHi;uniform vec3 uFringe;uniform vec3 uHorizon;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),
             mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0.,a=.5;
  for(int i=0;i<5;i++){v+=a*noise(p);p*=2.03;a*=.5;}
  return v;
}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  float t=uT*.05;
  // night sky base gradient
  vec3 col=mix(uSkyLow,uSkyHigh,uv.y*.8);

  // stars
  vec2 sp=gl_FragCoord.xy/3.;
  float st=hash(floor(sp));
  if(st>.996){
    float tw=.5+.5*sin(uT*2.+st*40.);
    col+=uStar*tw*smoothstep(.996,1.,st)*.9*uv.y;
  }

  // aurora curtains: sample fbm along distorted coords
  float curtainX=uv.x*3.+fbm(vec2(uv.x*2.5+t,t*.7))*2.;
  float band=fbm(vec2(curtainX,t));
  float y0=.38+band*.34;                 // curtain lower edge
  float fall=uv.y-y0;
  float intensity=smoothstep(0.,.06,fall)*exp(-fall*3.4);
  float rays=.6+.4*fbm(vec2(uv.x*14.+t*3.,uv.y*2.-t));
  intensity*=rays;
  // second higher curtain
  float band2=fbm(vec2(uv.x*2.2-t*1.4,t*.5+7.));
  float y1=.55+band2*.3;
  float fall2=uv.y-y1;
  float in2=smoothstep(0.,.09,fall2)*exp(-fall2*4.2)*.7;

  vec3 aur=uCurtain*intensity + uCurtainHi*in2;
  aur+=uFringe*intensity*intensity*.25; // pink fringe at base
  col+=aur*.85;

  // horizon glow
  col+=uHorizon*exp(-uv.y*6.)*1.2;

  col+=(hash(gl_FragCoord.xy+uT)*.025-.0125);
  gl_FragColor=vec4(col,1.);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

/**
 * Full-bleed aurora: layered fbm noise curtains over a starfield, drawn in a fragment shader.
 * Shader colors come from the `--gl-*` tokens. Falls back to a CSS gradient without WebGL.
 */
export function initSky(canvas: HTMLCanvasElement): void {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
  const prog = gl?.createProgram();
  if (!gl || !prog) {
    canvas.classList.add('no-webgl');
    return;
  }
  const vert = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const frag = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  if (!vert || !frag) {
    canvas.remove();
    return;
  }
  gl.attachShader(prog, vert);
  gl.attachShader(prog, frag);
  gl.linkProgram(prog);
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'uRes');
  const uT = gl.getUniformLocation(prog, 'uT');
  const colors: [string, `--${string}`][] = [
    ['uSkyLow', '--gl-sky-low'],
    ['uSkyHigh', '--gl-sky-high'],
    ['uStar', '--gl-star'],
    ['uCurtain', '--gl-curtain'],
    ['uCurtainHi', '--gl-curtain-hi'],
    ['uFringe', '--gl-fringe'],
    ['uHorizon', '--gl-horizon'],
  ];
  for (const [uniform, name] of colors) gl.uniform3fv(gl.getUniformLocation(prog, uniform), tokenVec3(name));

  const reduced = prefersReducedMotion();
  const start = performance.now();
  // The shader's time origin is offset so the first frame already shows developed curtains.
  const draw = (now: number) => {
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uT, reduced ? 30 : (now - start) / 1000 + 30);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const loop = rafLoop(draw);
  fitCanvas(canvas, {
    maxDpr: 1.5,
    onResize: () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (!loop.running) draw(start);
    },
  });
  if (!reduced) loop.start();
}
