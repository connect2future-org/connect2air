import * as THREE from 'three';
import { BRAND } from './constants';

/**
 * Shared, module-level material instances.
 *
 * Creating these once (instead of once per mesh) keeps the draw-call state
 * changes low and guarantees the drone reads as one coherent product.
 * They live for the whole app lifetime, which is exactly what we want for a
 * single hero model.
 */

const std = (
  params: THREE.MeshStandardMaterialParameters,
): THREE.MeshStandardMaterial => new THREE.MeshStandardMaterial(params);

export const MATERIALS = {
  /* ---------------- Structural ---------------- */

  hull: std({
    color: '#1b1f24',
    metalness: 0.88,
    roughness: 0.28,
  }),

  hullDark: std({
    color: '#0d0f12',
    metalness: 0.9,
    roughness: 0.34,
  }),

  graphite: std({
    color: '#23272d',
    metalness: 0.85,
    roughness: 0.3,
  }),

  steel: std({
    color: '#9aa2ab',
    metalness: 0.95,
    roughness: 0.2,
  }),

  chrome: std({
    color: '#dfe4e9',
    metalness: 1.0,
    roughness: 0.1,
  }),

  glass: std({
    color: '#05060a',
    metalness: 0.5,
    roughness: 0.06,
  }),

  rubber: std({
    color: '#0a0b0d',
    metalness: 0.15,
    roughness: 0.78,
  }),

  /* ---------------- Brand accents ---------------- */

  pink: std({
    color: BRAND.pink,
    emissive: new THREE.Color(BRAND.pink),
    emissiveIntensity: 2.6,
    metalness: 0.35,
    roughness: 0.35,
  }),

  pinkDim: std({
    color: BRAND.pinkDeep,
    emissive: new THREE.Color(BRAND.pink),
    emissiveIntensity: 1.35,
    metalness: 0.4,
    roughness: 0.42,
  }),

  /* ---------------- Propellers ---------------- */

  blade: std({
    color: '#14171b',
    metalness: 0.6,
    roughness: 0.38,
    transparent: true,
    opacity: 0.66,
    side: THREE.DoubleSide,
  }),

  /* ---------------- Screen + suspension ---------------- */

  screenHousing: std({
    color: '#0b0d10',
    metalness: 0.82,
    roughness: 0.36,
  }),

  cable: std({
    color: '#2a2f36',
    metalness: 0.72,
    roughness: 0.48,
  }),
} as const;