import { fitCanvas, rafLoop } from '~/lib/canvas';
import { prefersReducedMotion } from '~/lib/motion';
import { tokenVec3 } from '~/lib/tokens';
import type { MoodId } from './content';

export interface Sky {
  setMood(id: MoodId): void;
}

type Vec3 = [number, number, number];

interface Mood {
  top: Vec3;
  bot: Vec3;
  lit: Vec3;
  shade: Vec3;
  /** Sun glow strength (dawn only). */
  sun: number;
  /** Cloud coverage. */
  dense: number;
}

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `
precision highp float;
uniform vec2 uRes;uniform float uT;uniform float uFlash;
uniform vec3 uSkyTop;uniform vec3 uSkyBot;uniform vec3 uCloudLit;uniform vec3 uCloudShade;
uniform vec3 uSunCore;uniform vec3 uSunHalo;uniform vec3 uFlashCol;
uniform float uSun;uniform float uDense;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),
             mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0.,a=.5;
  for(int i=0;i<6;i++){v+=a*noise(p);p=p*2.02+vec2(13.7,9.1);a*=.5;}
  return v;
}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  float t=uT*.016;
  vec3 col=mix(uSkyBot,uSkyTop,uv.y);

  // sun glow (dawn)
  if(uSun>0.01){
    vec2 sp=vec2(.72,.30);
    float d=distance(vec2(uv.x*uRes.x/uRes.y,uv.y),vec2(sp.x*uRes.x/uRes.y,sp.y));
    col+=uSunCore*exp(-d*5.5)*uSun;
    col+=uSunHalo*exp(-d*1.8)*.35*uSun;
  }

  // cloud layers
  float sc=2.6;
  float n=fbm(vec2(uv.x*sc+t,uv.y*sc*1.6-t*.3));
  float n2=fbm(vec2(uv.x*sc*2.2-t*.6,uv.y*sc*2.8+t*.2)+40.);
  float cl=smoothstep(.52-uDense*.22,.78,n*.72+n2*.38);
  // shading: sample noise slightly above for lit edge
  float nUp=fbm(vec2(uv.x*sc+t,(uv.y+.05)*sc*1.6-t*.3));
  float lit=clamp((n-nUp)*4.+.5,0.,1.);
  vec3 cloud=mix(uCloudShade,uCloudLit,lit);
  col=mix(col,cloud,cl*.92);

  // lightning flash
  col+=uFlashCol*uFlash*(.35+cl*.6);

  // vignette + grain
  col*=1.-.28*distance(uv,vec2(.5,.42));
  col+=(hash(gl_FragCoord.xy+uT)*.028-.014);
  gl_FragColor=vec4(col,1.);
}`;

const lerpArr = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i] - v) * t);

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
 * Fullscreen fbm cloud shader. Mood palettes come from the `--<mood>-top|bot|lit|shade` tokens
 * and ease toward the selected mood each frame; the storm mood fires lightning flashes.
 * Falls back to a CSS gradient (`.no-gl`) without WebGL, or removes the canvas if the shader fails.
 */
export function initSky(canvas: HTMLCanvasElement): Sky | null {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
  if (!gl) {
    canvas.classList.add('no-gl');
    return null;
  }
  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) {
    canvas.remove();
    return null;
  }
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (name: string) => gl.getUniformLocation(program, name);
  const uRes = U('uRes');
  const uT = U('uT');
  const uFlash = U('uFlash');
  const uSkyTop = U('uSkyTop');
  const uSkyBot = U('uSkyBot');
  const uCloudLit = U('uCloudLit');
  const uCloudShade = U('uCloudShade');
  const uSun = U('uSun');
  const uDense = U('uDense');
  gl.uniform3fv(U('uSunCore'), tokenVec3('--sun-core'));
  gl.uniform3fv(U('uSunHalo'), tokenVec3('--sun-halo'));
  gl.uniform3fv(U('uFlashCol'), tokenVec3('--flash'));

  fitCanvas(canvas, { maxDpr: 1.4, onResize: () => gl.viewport(0, 0, canvas.width, canvas.height) });

  const palette = (id: MoodId, sun: number, dense: number): Mood => ({
    top: tokenVec3(`--${id}-top`),
    bot: tokenVec3(`--${id}-bot`),
    lit: tokenVec3(`--${id}-lit`),
    shade: tokenVec3(`--${id}-shade`),
    sun,
    dense,
  });
  const MOODS: Record<MoodId, Mood> = {
    dawn: palette('dawn', 1, 0.25),
    storm: palette('storm', 0, 0.85),
    rain: palette('rain', 0, 0.6),
  };
  const cur: Mood = structuredClone(MOODS.dawn);
  let target = MOODS.dawn;
  let mode: MoodId = 'dawn';
  let flash = 0;
  let nextFlash = 4000;
  const reduced = prefersReducedMotion();
  const t0 = performance.now();

  rafLoop((now) => {
    const el = (now - t0) / 1000;
    // ease toward target palette
    cur.top = lerpArr(cur.top, target.top, 0.03) as Vec3;
    cur.bot = lerpArr(cur.bot, target.bot, 0.03) as Vec3;
    cur.lit = lerpArr(cur.lit, target.lit, 0.03) as Vec3;
    cur.shade = lerpArr(cur.shade, target.shade, 0.03) as Vec3;
    cur.sun += (target.sun - cur.sun) * 0.03;
    cur.dense += (target.dense - cur.dense) * 0.03;
    // lightning
    if (mode === 'storm') {
      nextFlash -= 16;
      if (nextFlash <= 0) {
        flash = 0.9;
        nextFlash = 2400 + Math.random() * 4800;
      }
    }
    flash *= 0.88;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uT, reduced ? 20 : el);
    gl.uniform1f(uFlash, flash);
    gl.uniform3fv(uSkyTop, cur.top);
    gl.uniform3fv(uSkyBot, cur.bot);
    gl.uniform3fv(uCloudLit, cur.lit);
    gl.uniform3fv(uCloudShade, cur.shade);
    gl.uniform1f(uSun, cur.sun);
    gl.uniform1f(uDense, cur.dense);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }).start();

  return {
    setMood(id) {
      target = MOODS[id];
      mode = id;
    },
  };
}
