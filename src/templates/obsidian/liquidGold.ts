import { fitCanvas, rafLoop } from '~/lib/canvas';
import { prefersReducedMotion } from '~/lib/motion';
import { tokenVec3 } from '~/lib/tokens';

const VERTEX = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAGMENT = `
precision highp float;
uniform vec2 uRes; uniform float uT; uniform vec2 uM;
uniform vec3 uGold; uniform vec3 uSpec; uniform vec3 uRim;
uniform vec3 uBgFar; uniform vec3 uBgNear; uniform vec3 uBloom;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}

float map(vec3 p){
  float t=uT*.35;
  vec3 q1=p-vec3(sin(t*.7)*.52, cos(t*.9)*.42, sin(t*.5)*.28);
  vec3 q2=p-vec3(cos(t*.6)*-.48, sin(t*.8)*.5, cos(t*.4)*.22);
  vec3 q3=p-vec3(sin(t*1.1)*.4, cos(t*.62)*-.48, sin(t*.75)*.3);
  vec3 q4=p-vec3(uM.x*.9, uM.y*.55, .15);
  float d=length(q1)-.58;
  d=smin(d,length(q2)-.46,.5);
  d=smin(d,length(q3)-.36,.5);
  d=smin(d,length(q4)-.28,.55);
  // subtle surface ripple
  d+=sin(p.x*9.+t*2.)*sin(p.y*8.-t*1.5)*sin(p.z*7.)*.012;
  return d;
}
vec3 norm(vec3 p){
  vec2 e=vec2(.0015,0.);
  return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));
}
void main(){
  vec2 uv=(gl_FragCoord.xy*2.-uRes)/uRes.y;
  // background: deep vignette with warm bloom upper-right
  float vg=length(uv-vec2(.45,.15));
  vec3 col=mix(uBgFar,uBgNear,smoothstep(0.,1.35,vg));
  col+=uBloom*exp(-vg*2.2);

  bool portrait=uRes.x<uRes.y;
  vec2 comp=portrait?vec2(.02,.62):vec2(.15,-.34);
  vec3 ro=vec3(uM.x*.12,uM.y*.08,portrait?3.9:3.15);
  vec3 rd=normalize(vec3(uv-comp,-1.9));

  float tr=0.; float d; bool hit=false;
  for(int i=0;i<72;i++){
    d=map(ro+rd*tr);
    if(d<.0018){hit=true;break;}
    tr+=d*.9;
    if(tr>7.)break;
  }
  if(hit){
    vec3 p=ro+rd*tr; vec3 n=norm(p);
    vec3 gold=uGold;
    vec3 l1=normalize(vec3(.7,.9,.5));
    vec3 l2=normalize(vec3(-.8,-.3,.4));
    float dif=max(dot(n,l1),0.);
    float bou=max(dot(n,l2),0.)*.25;
    vec3 r=reflect(rd,n);
    // fake studio softbox stripes in reflection
    float box=smoothstep(.2,.9,sin(r.y*6.+r.x*2.)*.5+.5);
    float spec=pow(max(dot(r,l1),0.),42.);
    float fres=pow(1.-max(dot(n,-rd),0.),3.);
    float ao=clamp(map(p+n*.22)/.22,0.,1.)*.6+.4;
    vec3 c=gold*(.14+dif*.85)*ao;
    c+=uSpec*spec*1.4;
    c+=gold*box*fres*1.1;
    c+=uRim*fres*.45;
    c+=gold*bou;
    col=c;
  }
  // grain + tonal
  col=pow(col,vec3(.92));
  col+=(hash(gl_FragCoord.xy+uT)*.03-.015);
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
 * Raymarched liquid-gold metaballs (SDF + smooth-min) filling `canvas`.
 * Shader colors come from the `--gl-*` tokens. Hides the canvas when WebGL is unavailable.
 */
export function initLiquidGold(canvas: HTMLCanvasElement): void {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
  const prog = gl?.createProgram();
  if (!gl || !prog) {
    canvas.style.display = 'none';
    return;
  }
  const vert = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const frag = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  if (!vert || !frag) {
    canvas.style.display = 'none';
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
  const uM = gl.getUniformLocation(prog, 'uM');
  gl.uniform3fv(gl.getUniformLocation(prog, 'uGold'), tokenVec3('--gl-gold'));
  gl.uniform3fv(gl.getUniformLocation(prog, 'uSpec'), tokenVec3('--gl-spec'));
  gl.uniform3fv(gl.getUniformLocation(prog, 'uRim'), tokenVec3('--gl-rim'));
  gl.uniform3fv(gl.getUniformLocation(prog, 'uBgFar'), tokenVec3('--gl-bg-far'));
  gl.uniform3fv(gl.getUniformLocation(prog, 'uBgNear'), tokenVec3('--gl-bg-near'));
  gl.uniform3fv(gl.getUniformLocation(prog, 'uBloom'), tokenVec3('--gl-bloom'));

  const reduced = prefersReducedMotion();
  const start = performance.now();
  let mx = 0;
  let my = 0;
  let tx = 0;
  let ty = 0;
  addEventListener('pointermove', (e) => {
    tx = (e.clientX / innerWidth) * 2 - 1;
    ty = -((e.clientY / innerHeight) * 2 - 1);
  });

  const draw = (now: number) => {
    mx += (tx - mx) * 0.04;
    my += (ty - my) * 0.04;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uT, reduced ? 0 : (now - start) / 1000);
    gl.uniform2f(uM, mx, my);
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
