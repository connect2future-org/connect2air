import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DroneFormation } from './DroneFormation';

/* ------------------------------------------------------------------ */
/* TUNING                                                             */
/* ------------------------------------------------------------------ */

const POINTER_DAMP = 12;

/* Hover-based rotation (small, subtle) */
const YAW_AMOUNT = 1.25;
const TILT_AMOUNT = 0.85;
const ROLL_AMOUNT = 0.35;

/* Hover-based translation */
const TRANSLATE_X = 0.45;
const TRANSLATE_Y = 0.35;
const TRANSLATE_Z = 1.1;

/* Drag-based rotation sensitivity (radians per pixel) */
const DRAG_SENSITIVITY = 0.008;

/* How fast the drag rotation eases back to neutral when released */
const DRAG_RETURN_RATE = 1.1;

/**
 * Hero drone.
 *
 *  • Hover over the canvas → subtle cinematic yaw / pitch / roll
 *  • Click and drag anywhere → rotate the drone freely on all axes (360°)
 *  • Release → smoothly eases back to the neutral hovering pose
 */
export function HeroDrone() {
  const groupRef = useRef<THREE.Group>(null);

  const pointer = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });

  // Drag state — tracks the accumulated rotation from mouse drag
  const drag = useRef({
    active: false,
    lastX: 0,
    lastY: 0,
  });
  const spin = useRef({ x: 0, y: 0 });

  /* ---------------------------------------------------------------- */
  /* Whole-window pointer tracking                                     */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;

      // Hover position (-1 → +1 on both axes)
      pointer.current.x = (event.clientX / width) * 2 - 1;
      pointer.current.y = -((event.clientY / height) * 2 - 1);

      // Drag rotation accumulation
      if (drag.current.active) {
        const dx = event.clientX - drag.current.lastX;
        const dy = event.clientY - drag.current.lastY;

        drag.current.lastX = event.clientX;
        drag.current.lastY = event.clientY;

        // Yaw (horizontal drag) and pitch (vertical drag)
        spin.current.y += dx * DRAG_SENSITIVITY;
        spin.current.x += dy * DRAG_SENSITIVITY;
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      // Ignore right-click / middle-click
      if (event.button !== 0) return;

      drag.current.active = true;
      drag.current.lastX = event.clientX;
      drag.current.lastY = event.clientY;
    };

    const onPointerUp = () => {
      drag.current.active = false;
    };

    const onBlur = () => {
      drag.current.active = false;
      pointer.current.x = 0;
      pointer.current.y = 0;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  /* ---------------------------------------------------------------- */
  /* Per-frame animation                                              */
  /* ---------------------------------------------------------------- */

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;

    const s = smooth.current;
    const sp = spin.current;

    // Fast, direct damping for hover
    s.x = THREE.MathUtils.damp(s.x, pointer.current.x, POINTER_DAMP, dt);
    s.y = THREE.MathUtils.damp(s.y, pointer.current.y, POINTER_DAMP, dt);

    // When not dragging, ease the drag rotation back toward neutral.
    // This makes the drone always return to a nice, cinematic pose.
    if (!drag.current.active) {
      sp.x = THREE.MathUtils.damp(sp.x, 0, DRAG_RETURN_RATE, dt);
      sp.y = THREE.MathUtils.damp(sp.y, 0, DRAG_RETURN_RATE, dt);
    }

    /* -------- autonomous hover -------- */

    const floatY =
      Math.sin(t * 0.85) * 0.055 + Math.sin(t * 1.63 + 1.1) * 0.022;

    const driftX = Math.sin(t * 0.47 + 0.6) * 0.05;
    const driftZ = Math.cos(t * 0.57 + 1.9) * 0.035;

    const idleYaw = Math.sin(t * 0.31) * 0.045;
    const idleTilt = Math.sin(t * 0.53 + 2.4) * 0.014;
    const idleRoll = Math.sin(t * 0.71 + 0.9) * 0.008;

    /* -------- position -------- */

    group.position.set(
      driftX + s.x * TRANSLATE_X,
      floatY + s.y * TRANSLATE_Y,
      driftZ + s.y * TRANSLATE_Z,
    );

    /* -------- rotation (hover + drag) -------- */

    group.rotation.set(
      // PITCH: hover pitch + drag pitch
      -s.y * TILT_AMOUNT + idleTilt + sp.x,
      // YAW: hover yaw + drag yaw
      -s.x * YAW_AMOUNT + idleYaw + sp.y,
      // ROLL: hover roll
      -s.x * ROLL_AMOUNT + s.y * 0.06 + idleRoll,
    );
  });

  return (
    <group ref={groupRef}>
      <DroneFormation />
    </group>
  );
}