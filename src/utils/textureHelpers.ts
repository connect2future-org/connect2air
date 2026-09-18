import * as THREE from 'three';
import { BRAND } from './constants';

const SANS =
  'Inter, "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif';

/* ------------------------------------------------------------------ */
/* DEFAULT SCREEN ARTWORK                                             */
/* ------------------------------------------------------------------ */

export function createDefaultScreenTexture(): THREE.CanvasTexture {
  const W = 1024;
  const H = 1432;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    fallback.colorSpace = THREE.SRGBColorSpace;
    return fallback;
  }

  /* ---------------- background: pure black ---------------- */

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  /* ---------------- very subtle pure-black vignette ---------------- */

  const vignette = ctx.createRadialGradient(
    W / 2,
    H / 2,
    H * 0.1,
    W / 2,
    H / 2,
    H * 0.75,
  );
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.95)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);

  /* ---------------- pink frame ---------------- */

  ctx.strokeStyle = 'rgba(255,31,143,0.85)';
  ctx.lineWidth = 5;
  ctx.strokeRect(38, 38, W - 76, H - 76);

  const corner = 120;
  const o = 38;

  ctx.strokeStyle = 'rgba(255,31,143,1)';
  ctx.lineWidth = 10;
  ctx.lineCap = 'square';
  ctx.beginPath();
  ctx.moveTo(o, o + corner);
  ctx.lineTo(o, o);
  ctx.lineTo(o + corner, o);

  ctx.moveTo(W - o - corner, o);
  ctx.lineTo(W - o, o);
  ctx.lineTo(W - o, o + corner);

  ctx.moveTo(W - o, H - o - corner);
  ctx.lineTo(W - o, H - o);
  ctx.lineTo(W - o - corner, H - o);

  ctx.moveTo(o + corner, H - o);
  ctx.lineTo(o, H - o);
  ctx.lineTo(o, H - o - corner);
  ctx.stroke();

  /* ---------------- copy ---------------- */

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = 'rgba(255,255,255,0.58)';
  ctx.font = `600 40px ${SANS}`;
  ctx.fillText('CONNECT2AIR', W / 2, 252);

  ctx.fillStyle = 'rgba(255,31,143,0.95)';
  ctx.fillRect(W / 2 - 92, 304, 184, 3);

  /* Smaller fonts → fit inside the ~789px crop-safe zone. */

  ctx.fillStyle = '#ffffff';
  ctx.font = `800 88px ${SANS}`;
  ctx.fillText('CLICK TO', W / 2, 612);

  ctx.fillStyle = BRAND.pink;
  ctx.font = `800 88px ${SANS}`;
  ctx.fillText('ADD PREVIEW', W / 2, 742);

  ctx.fillStyle = 'rgba(255,255,255,0.16)';
  ctx.fillRect(W / 2 - 205, 862, 410, 2);

  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.font = `700 60px ${SANS}`;
  ctx.fillText('UPLOAD YOUR AD', W / 2, 974);

  ctx.fillStyle = 'rgba(255,255,255,0.36)';
  ctx.font = `400 33px ${SANS}`;
  ctx.fillText('JPG   ·   PNG   ·   WEBP   ·   MAX 10 MB', W / 2, 1058);

  ctx.fillStyle = 'rgba(255,31,143,0.6)';
  ctx.font = `600 29px ${SANS}`;
  ctx.fillText('BRANDS THAT FLY HIGHER', W / 2, H - 152);

  /* ---------------- LED matrix hint ---------------- */

  ctx.globalAlpha = 0.05;
  ctx.fillStyle = '#ffffff';
  for (let y = 20; y < H; y += 8) {
    ctx.fillRect(0, y, W, 2);
  }
  ctx.globalAlpha = 1;

  /* ---------------- texture ---------------- */

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 8;
  texture.needsUpdate = true;

  return texture;
}

/* ------------------------------------------------------------------ */
/* LED MATRIX PROCESSOR                                               */
/* ------------------------------------------------------------------ */

/**
 * Kept here in case you ever want to re-enable a pixel-grid look on the
 * panel. Not currently used by LEDScreen.tsx.
 */
export function createLedMatrixTexture(
  source: HTMLImageElement | HTMLCanvasElement,
  cols: number = 104,
  rows: number = 142,
): THREE.CanvasTexture {
  const W = 1024;
  const H = 1432;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    fallback.colorSpace = THREE.SRGBColorSpace;
    return fallback;
  }

  const tinyCanvas = document.createElement('canvas');
  tinyCanvas.width = cols;
  tinyCanvas.height = rows;

  const tinyCtx = tinyCanvas.getContext('2d');

  if (tinyCtx) {
    tinyCtx.fillStyle = '#000000';
    tinyCtx.fillRect(0, 0, cols, rows);

    const srcW = (source as HTMLImageElement).naturalWidth || source.width || 1;
    const srcH = (source as HTMLImageElement).naturalHeight || source.height || 1;
    const srcAspect = srcW / srcH;
    const dstAspect = cols / rows;

    let drawW = cols;
    let drawH = rows;

    if (srcAspect > dstAspect) {
      drawH = cols / srcAspect;
    } else {
      drawW = rows * srcAspect;
    }

    const dx = (cols - drawW) / 2;
    const dy = (rows - drawH) / 2;

    tinyCtx.imageSmoothingEnabled = true;
    tinyCtx.drawImage(source, dx, dy, drawW, drawH);
  }

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tinyCanvas, 0, 0, W, H);

  const cellW = W / cols;
  const cellH = H / rows;
  const gap = Math.max(2, Math.min(cellW, cellH) * 0.15);

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.92)';
  ctx.lineWidth = gap;
  ctx.beginPath();

  for (let i = 0; i <= cols; i++) {
    const x = i * cellW;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
  }
  for (let j = 0; j <= rows; j++) {
    const y = j * cellH;
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
  }

  ctx.stroke();

  ctx.globalAlpha = 0.28;
  ctx.globalCompositeOperation = 'lighter';
  ctx.drawImage(tinyCanvas, 0, 0, W, H);

  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 8;
  texture.needsUpdate = true;

  return texture;
}