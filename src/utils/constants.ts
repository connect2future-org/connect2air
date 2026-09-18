/**
 * Connect2Air brand palette + shared scene geometry constants.
 */

export const BRAND = {
  pink: '#ff1f8f',
  pinkSoft: '#ff6fb5',
  pinkDeep: '#c4006a',
  black: '#000000',
  graphite: '#141619',
  gunmetal: '#23272c',
  steel: '#3a4047',
  silver: '#c7ccd2',
  white: '#ffffff',
} as const;

export const SQRT1_2 = Math.SQRT1_2;

export const DRONE = {
  armSpan: 1.42,
  armMid: 0.95,
  armLength: 1.18,
  propRadius: 0.62,
  propSpeed: 27,
  cableMountY: -0.16,

  /* ---------------- Advertising screen ---------------- */
  /* Elongated and paper-thin. */
  screenWidth: 2.15,
  screenHeight: 3.85,
  screenDepth: 0.05,

  /* Y centre of the screen, relative to the drone body centre. */
  screenY: -3.05,

  /* Vertical offset applied to the whole formation so it stays centred. */
  assemblyOffsetY: 2.25,
} as const;

/** Y position of the top edge of the screen (the cable anchor line). */
export const SCREEN_TOP_Y = DRONE.screenY + DRONE.screenHeight / 2;

/** X position of the two cable attachment points on the top edge. */
export const SCREEN_CABLE_X = DRONE.screenWidth / 2 - 0.16;

export const ARM_DIRS: ReadonlyArray<readonly [number, number]> = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
] as const;

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const ACCEPTED_MIME = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
] as const;

export const ACCEPT_ATTRIBUTE = 'image/jpeg,image/jpg,image/png,image/webp';