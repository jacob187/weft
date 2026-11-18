import { fitCanvas, rafLoop } from '~/lib/canvas';
import { tokenRgba, token } from '~/lib/tokens';
import type { Synth } from './synth';

/**
 * Oscilloscope: plots the synth's AnalyserNode time-domain data (2,048 samples) every frame.
 * Before the audio engine exists it draws a gentle idle sine so the scope never looks dead.
 */
export function scope(canvas: HTMLCanvasElement, synth: Synth): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  fitCanvas(canvas, { maxDpr: 1.5 });

  const gridStroke = tokenRgba('--violet', 0.09);
  const axisStroke = tokenRgba('--violet', 0.18);
  const traceStroke = token('--violet');
  const glow = tokenRgba('--violet', 0.7);
  const buf = new Uint8Array(2048);

  rafLoop((t) => {
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    // grid
    ctx.strokeStyle = gridStroke;
    ctx.lineWidth = 1;
    for (let gx = 0; gx < W; gx += W / 12) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, H);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.strokeStyle = axisStroke;
    ctx.stroke();
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = traceStroke;
    ctx.shadowColor = glow;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    const analyser = synth.analyser;
    if (analyser) {
      analyser.getByteTimeDomainData(buf);
      for (let i = 0; i < buf.length; i++) {
        const x = (i / buf.length) * W;
        const y = (buf[i] / 255) * H;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
    } else {
      for (let i = 0; i <= 120; i++) {
        const x = (i / 120) * W;
        const y = H / 2 + Math.sin((i / 120) * Math.PI * 4 + t / 600) * H * 0.16 * Math.sin(t / 1900);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }).start();
}
