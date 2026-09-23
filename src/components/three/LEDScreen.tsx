import {
  useEffect,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import { BRAND, DRONE } from '../../utils/constants';
import { createDefaultScreenTexture } from '../../utils/textureHelpers';
import { useScreenUpload } from './UploadPreview';

const W = DRONE.screenWidth;
const H = DRONE.screenHeight;

/* High segment count → smooth cloth-like deformation. */
const SEG_X = 24;
const SEG_Y = 48;

const CLICK_TOLERANCE = 5;

/* Tiny Z offsets so the two faces never z-fight. */
const FRONT_Z = 0.0006;
const BACK_Z = -0.0006;

/* ------------------------------------------------------------------ */
/* BORDERED TEXTURE                                                    */
/* ------------------------------------------------------------------ */

function createBorderedTexture(
  source: HTMLImageElement | HTMLCanvasElement,
): THREE.CanvasTexture {
  const CW = 1024;
  const CH = Math.round((DRONE.screenHeight / DRONE.screenWidth) * CW);

  const canvas = document.createElement('canvas');
  canvas.width = CW;
  canvas.height = CH;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    fallback.colorSpace = THREE.SRGBColorSpace;
    return fallback;
  }

  /* --- Pink outer band --- */
  ctx.fillStyle = BRAND.pink;
  ctx.fillRect(0, 0, CW, CH);

  /* --- Black bezel --- */
  const PINK_BAND = 11;
  ctx.fillStyle = '#0a0a0e';
  ctx.fillRect(PINK_BAND, PINK_BAND, CW - PINK_BAND * 2, CH - PINK_BAND * 2);

  /* --- Image area --- */
  const BEZEL = 5;
  const imgX = PINK_BAND + BEZEL;
  const imgY = PINK_BAND + BEZEL;
  const imgW = CW - imgX * 2;
  const imgH = CH - imgY * 2;

  /* --- Cover fit --- */
  const srcW = (source as HTMLImageElement).naturalWidth || source.width || 1;
  const srcH = (source as HTMLImageElement).naturalHeight || source.height || 1;
  const srcAspect = srcW / srcH;
  const dstAspect = imgW / imgH;

  let drawW: number;
  let drawH: number;

  if (srcAspect > dstAspect) {
    drawH = imgH;
    drawW = drawH * srcAspect;
  } else {
    drawW = imgW;
    drawH = drawW / srcAspect;
  }

  const dx = imgX + (imgW - drawW) / 2;
  const dy = imgY + (imgH - drawH) / 2;

  ctx.save();
  ctx.beginPath();
  ctx.rect(imgX, imgY, imgW, imgH);
  ctx.clip();
  ctx.drawImage(source, dx, dy, drawW, drawH);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

/* ------------------------------------------------------------------ */
/* COMPONENT                                                           */
/* ------------------------------------------------------------------ */

export function LEDScreen() {
  const { texture, openPicker } = useScreenUpload();
  const [hovered, setHovered] = useState(false);

  /* ---------------- deformable geometry (shared by both faces) ----- */

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(W, H, SEG_X, SEG_Y);
    // Cache the rest-pose positions so we always displace from a stable base.
    g.userData.original = new Float32Array(g.attributes.position.array);
    return g;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  /* ---------------- base texture ---------------- */

  const defaultTexture = useMemo(() => createDefaultScreenTexture(), []);

  useEffect(() => () => defaultTexture.dispose(), [defaultTexture]);

  const displayTexture = texture ?? defaultTexture;

  /* ---------------- framed texture (pink border + image) ---------------- */

  const finalTexture = useMemo(() => {
    const image = displayTexture.image as
      | HTMLImageElement
      | HTMLCanvasElement
      | undefined;

    if (!image) return displayTexture;

    return createBorderedTexture(image);
  }, [displayTexture]);

  useEffect(() => {
    return () => {
      if (finalTexture !== displayTexture) {
        finalTexture.dispose();
      }
    };
  }, [finalTexture, displayTexture]);

  /* ---------------- wind animation ---------------- */

  useFrame((state) => {
    const pos = geometry.attributes.position;
    const orig = geometry.userData.original as Float32Array;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < pos.count; i++) {
      const ix = i * 3;
      const ox = orig[ix];
      const oy = orig[ix + 1];

      /* 0 at the top edge, 1 at the bottom edge. Quadratic falloff makes
       * the top rigid (matches the mounting bar) and the bottom loose. */
      const dy = Math.max(0, (H / 2 - oy) / H);
      const falloff = dy * dy;

      /* Multi-frequency wave along Z — the main fabric ripple. */
      const waveZ =
        Math.sin(oy * 1.6 + t * 1.05) * 0.32 * falloff +
        Math.sin(oy * 3.4 + t * 1.85) * 0.09 * falloff +
        Math.cos(ox * 1.4 + t * 1.4) * 0.06 * falloff;

      /* Horizontal squeeze/bulge — subtle side-to-side breathing. */
      const waveX =
        Math.sin(oy * 1.25 + t * 0.85) * 0.05 * falloff +
        Math.cos(oy * 2.8 + t * 1.5) * 0.02 * falloff;

      pos.array[ix] = ox + waveX;
      pos.array[ix + 1] = oy;
      pos.array[ix + 2] = waveZ;
    }

    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  /* ---------------- pointer cursor ---------------- */

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : '';
    return () => {
      document.body.style.cursor = '';
    };
  }, [hovered]);

  /* ---------------- handlers ---------------- */

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
  };

  const onOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
  };

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.delta > CLICK_TOLERANCE) return;
    openPicker();
  };

  const stopDomPointer = (e: ReactPointerEvent) => {
    e.stopPropagation();
  };

  /* Shared material configuration used by both faces.
   * Using MeshBasicMaterial with toneMapped={false} and a comfortable neutral tone (#d0d0d0)
   * prevents 3D scene lights and tone mapping from blowing out white poster backgrounds.
   * Uploaded poster text and graphics stay 100% crisp, rich, and perfectly legible. */
  const materialProps = {
    map: finalTexture,
    color: '#d0d0d0' as const,
    toneMapped: false,
    side: THREE.FrontSide,
  };

  /* ---------------- render ---------------- */

  return (
    <group position={[0, DRONE.screenY, 0]}>
      {/* ============================================================ */}
      {/* FRONT FACE                                                    */}
      {/* ============================================================ */}
      <mesh
        geometry={geometry}
        position={[0, 0, FRONT_Z]}
        onPointerOver={onOver}
        onPointerOut={onOut}
        onPointerDown={stopDomPointer}
        onClick={onClick}
      >
        <meshBasicMaterial {...materialProps} />
      </mesh>

      {/* ============================================================ */}
      {/* BACK FACE — physically rotated 180° so text reads correctly   */}
      {/* ============================================================ */}
      <mesh
        geometry={geometry}
        position={[0, 0, BACK_Z]}
        rotation={[0, Math.PI, 0]}
        onPointerOver={onOver}
        onPointerOut={onOut}
        onPointerDown={stopDomPointer}
        onClick={onClick}
      >
        <meshBasicMaterial {...materialProps} />
      </mesh>

      {/* ============================================================ */}
      {/* RIGID TOP MOUNTING BAR (never deforms)                        */}
      {/* ============================================================ */}
      <mesh position={[0, H / 2 + 0.008, 0]} raycast={() => null}>
        <boxGeometry args={[W * 0.99, 0.028, 0.06]} />
        <meshStandardMaterial
          color="#0a0a0c"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* ============================================================ */}
      {/* CABLE MOUNTING POINTS                                         */}
      {/* ============================================================ */}
      {[-1, 1].map((side) => (
        <group
          key={side}
          position={[side * (W / 2 - 0.1), H / 2 + 0.02, 0]}
        >
          <mesh raycast={() => null}>
            <cylinderGeometry args={[0.018, 0.018, 0.05, 14]} />
            <meshStandardMaterial
              color="#c7ccd2"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, 0.032, 0]} raycast={() => null}>
            <sphereGeometry args={[0.014, 10, 8]} />
            <meshStandardMaterial
              color="#ff1f8f"
              emissive="#ff1f8f"
              emissiveIntensity={2.4}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}