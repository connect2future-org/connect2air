import { useMemo } from 'react';
import * as THREE from 'three';
import { MATERIALS } from '../../utils/materials';
import {
  ARM_DIRS,
  DRONE,
  SCREEN_CABLE_X,
  SCREEN_TOP_Y,
  SQRT1_2,
} from '../../utils/constants';

interface CableDescriptor {
  key: string;
  geometry: THREE.TubeGeometry;
  start: [number, number, number];
  end: [number, number, number];
  hookRotation: [number, number, number];
}

const CABLE_RADIUS = 0.013;
const TUBULAR_SEGMENTS = 28;
const RADIAL_SEGMENTS = 8;

/**
 * Four suspension cables running from the underside of each motor mount down
 * to the top edge of the LED screen.
 *
 * The curves are taut with a very slight outward bow, they always stay above
 * the screen's top edge (so they can never clip the display), and they are
 * built once and reused.
 */
export function Cables() {
  const cables = useMemo<CableDescriptor[]>(() => {
    const motorRing = DRONE.armSpan * SQRT1_2;

    return ARM_DIRS.map(([sx, sz]) => {
      const start = new THREE.Vector3(
        sx * motorRing,
        DRONE.cableMountY,
        sz * motorRing,
      );

      const end = new THREE.Vector3(sx * SCREEN_CABLE_X, SCREEN_TOP_Y, 0);

      // Mid point, bowed very slightly outward for a believable catenary.
      const mid = start.clone().lerp(end, 0.5);
      mid.x += sx * 0.04;
      mid.z += sz * 0.04;

      const curve = new THREE.CatmullRomCurve3([start, mid, end], false, 'catmullrom', 0.4);

      const geometry = new THREE.TubeGeometry(
        curve,
        TUBULAR_SEGMENTS,
        CABLE_RADIUS,
        RADIAL_SEGMENTS,
        false,
      );

      return {
        key: `${sx}-${sz}`,
        geometry,
        start: [start.x, start.y, start.z],
        end: [end.x, end.y, end.z],
        hookRotation: [0, Math.atan2(sx, sz), 0],
      };
    });
  }, []);

  return (
    <group>
      {cables.map((cable) => (
        <group key={cable.key}>
          {/* The cable itself */}
          <mesh geometry={cable.geometry} material={MATERIALS.cable} />

          {/* Drone-side attachment hardware */}
          <group position={cable.start} rotation={cable.hookRotation}>
            <mesh material={MATERIALS.steel}>
              <cylinderGeometry args={[0.028, 0.032, 0.05, 14]} />
            </mesh>
            <mesh material={MATERIALS.hullDark} position={[0, 0.032, 0]}>
              <cylinderGeometry args={[0.036, 0.036, 0.018, 16]} />
            </mesh>
            <mesh material={MATERIALS.pink} position={[0, -0.028, 0]} raycast={() => null}>
              <sphereGeometry args={[0.014, 10, 8]} />
            </mesh>
          </group>

          {/* Screen-side attachment hardware */}
          <mesh material={MATERIALS.steel} position={cable.end}>
            <sphereGeometry args={[0.024, 14, 10]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}