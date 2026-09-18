import { useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import { MATERIALS } from '../../utils/materials';
import { ARM_DIRS, DRONE, SQRT1_2 } from '../../utils/constants';
import { Motor } from './Motor';

interface ArmDescriptor {
  index: number;
  sx: number;
  sz: number;
  angle: number;
  mid: [number, number, number];
  motor: [number, number, number];
}

/**
 * The complete heavy-lift advertising drone body.
 *
 * Everything is procedural — no GLB, no paid assets. Rounded boxes, scaled
 * spheres and cylinders are combined so the silhouette reads as an aerospace
 * product rather than a pile of primitives.
 */
export function Drone() {
  const arms = useMemo<ArmDescriptor[]>(
    () =>
      ARM_DIRS.map(([sx, sz], index) => {
        const nx = sx * SQRT1_2;
        const nz = sz * SQRT1_2;

        return {
          index,
          sx,
          sz,
          // Rotating (1,0,0) by `angle` around Y yields the arm direction.
          angle: Math.atan2(-nz, nx),
          mid: [nx * DRONE.armMid, 0, nz * DRONE.armMid],
          motor: [nx * DRONE.armSpan, 0, nz * DRONE.armSpan],
        };
      }),
    [],
  );

  return (
    <group>
      {/* ============================================================ */}
      {/* MAIN HULL                                                    */}
      {/* ============================================================ */}

      <mesh material={MATERIALS.hull} scale={[0.92, 0.3, 0.68]}>
        <sphereGeometry args={[1, 48, 32]} />
      </mesh>

      {/* Belly shell */}
      <mesh
        material={MATERIALS.hullDark}
        position={[0, -0.145, 0]}
        scale={[0.78, 0.16, 0.56]}
      >
        <sphereGeometry args={[1, 40, 24]} />
      </mesh>

      {/* Top deck */}
      <RoundedBox
        args={[1.16, 0.1, 0.86]}
        radius={0.04}
        smoothness={4}
        position={[0, 0.17, -0.02]}
        material={MATERIALS.graphite}
      />

      {/* Deck seam highlight */}
      <mesh
        material={MATERIALS.steel}
        position={[0, 0.222, -0.02]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.36, 0.39, 40]} />
      </mesh>

      {/* ============================================================ */}
      {/* UPPER EQUIPMENT HOUSING                                      */}
      {/* ============================================================ */}

      <RoundedBox
        args={[0.62, 0.2, 0.5]}
        radius={0.05}
        smoothness={4}
        position={[0, 0.3, -0.06]}
        material={MATERIALS.hullDark}
      />

      <mesh material={MATERIALS.steel} position={[0, 0.412, -0.06]}>
        <cylinderGeometry args={[0.05, 0.082, 0.05, 22]} />
      </mesh>

      {/* Antenna */}
      <mesh material={MATERIALS.graphite} position={[0.22, 0.46, -0.18]}>
        <cylinderGeometry args={[0.008, 0.013, 0.3, 8]} />
      </mesh>
      <mesh material={MATERIALS.pink} position={[0.22, 0.616, -0.18]}>
        <sphereGeometry args={[0.019, 12, 10]} />
      </mesh>

      {/* GPS puck */}
      <mesh
        material={MATERIALS.graphite}
        position={[-0.24, 0.412, -0.16]}
        rotation={[0.06, 0, 0]}
      >
        <cylinderGeometry args={[0.085, 0.095, 0.028, 24]} />
      </mesh>

      {/* ============================================================ */}
      {/* NOSE / CANOPY                                                */}
      {/* ============================================================ */}

      <mesh
        material={MATERIALS.glass}
        position={[0, 0.03, 0.5]}
        scale={[0.42, 0.17, 0.36]}
      >
        <sphereGeometry args={[1, 32, 20]} />
      </mesh>

      {/* ============================================================ */}
      {/* FRONT CAMERA MODULE                                          */}
      {/* ============================================================ */}

      <group position={[0, 0.02, 0.62]}>
        <mesh material={MATERIALS.hullDark}>
          <sphereGeometry args={[0.16, 28, 20]} />
        </mesh>

        <mesh
          material={MATERIALS.graphite}
          position={[0, 0.12, -0.02]}
          rotation={[0.4, 0, 0]}
        >
          <boxGeometry args={[0.2, 0.04, 0.16]} />
        </mesh>

        {/* Lens barrel */}
        <mesh
          material={MATERIALS.glass}
          position={[0, 0, 0.132]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.086, 0.086, 0.06, 30]} />
        </mesh>

        {/* Lens chrome ring */}
        <mesh
          material={MATERIALS.chrome}
          position={[0, 0, 0.158]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[0.088, 0.012, 8, 30]} />
        </mesh>

        {/* Iris */}
        <mesh
          position={[0, 0, 0.164]}
          rotation={[0, 0, 0]}
        >
          <circleGeometry args={[0.052, 26]} />
          <meshStandardMaterial
            color="#08203a"
            metalness={0.15}
            roughness={0.05}
            emissive="#1d5f92"
            emissiveIntensity={0.55}
          />
        </mesh>

        {/* Twin status LEDs */}
        <mesh material={MATERIALS.pink} position={[-0.062, 0.072, 0.108]}>
          <sphereGeometry args={[0.016, 10, 8]} />
        </mesh>
        <mesh material={MATERIALS.pink} position={[0.062, 0.072, 0.108]}>
          <sphereGeometry args={[0.016, 10, 8]} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* ARMS + MOTORS + PROPELLERS                                   */}
      {/* ============================================================ */}

      {arms.map((arm) => (
        <group
          key={arm.index}
          position={arm.mid}
          rotation={[0, arm.angle, 0]}
        >
          {/* Arm spar */}
          <RoundedBox
            args={[DRONE.armLength, 0.115, 0.17]}
            radius={0.05}
            smoothness={4}
            material={MATERIALS.graphite}
          />

          {/* Arm accent stripe */}
          <mesh
            material={MATERIALS.steel}
            position={[0, 0.062, 0]}
            raycast={() => null}
          >
            <boxGeometry args={[DRONE.armLength - 0.22, 0.012, 0.09]} />
          </mesh>

          {/* Arm root collar */}
          <mesh
            material={MATERIALS.hullDark}
            position={[-DRONE.armLength / 2 + 0.06, 0, 0]}
          >
            <cylinderGeometry args={[0.115, 0.13, 0.14, 20]} />
          </mesh>

          {/* Navigation light on the leading arms */}
          {arm.sz > 0 && (
            <mesh
              material={MATERIALS.pink}
              position={[DRONE.armLength / 2 - 0.16, 0.072, 0]}
              raycast={() => null}
            >
              <sphereGeometry args={[0.026, 12, 10]} />
            </mesh>
          )}
        </group>
      ))}

      {arms.map((arm) => (
        <Motor
          key={`motor-${arm.index}`}
          position={arm.motor}
          rotationY={arm.angle}
          reversed={arm.sx * arm.sz > 0}
        />
      ))}

      {/* ============================================================ */}
      {/* LOWER PAYLOAD STRUCTURE                                      */}
      {/* ============================================================ */}

      <RoundedBox
        args={[0.86, 0.07, 0.62]}
        radius={0.03}
        smoothness={4}
        position={[0, -0.252, 0]}
        material={MATERIALS.graphite}
      />

      {/* Payload rails */}
      {[-0.34, 0.34].map((x) => (
        <mesh
          key={x}
          material={MATERIALS.steel}
          position={[x, -0.3, 0]}
          raycast={() => null}
        >
          <boxGeometry args={[0.05, 0.05, 0.66]} />
        </mesh>
      ))}

      {/* Central winch / cable housing */}
      <mesh material={MATERIALS.hullDark} position={[0, -0.33, 0]}>
        <cylinderGeometry args={[0.16, 0.19, 0.09, 26]} />
      </mesh>
      <mesh
        material={MATERIALS.pinkDim}
        position={[0, -0.378, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        raycast={() => null}
      >
        <torusGeometry args={[0.145, 0.006, 6, 28]} />
      </mesh>

      {/* ============================================================ */}
      {/* LANDING SKIDS                                                */}
      {/* ============================================================ */}

      {[-0.5, 0.5].map((x) => (
        <group key={x} position={[x, -0.44, 0]}>
          {/* Skid rail */}
          <mesh material={MATERIALS.graphite}>
            <boxGeometry args={[0.055, 0.055, 0.94]} />
          </mesh>

          {/* Rubber pad */}
          <mesh material={MATERIALS.rubber} position={[0, -0.04, 0]}>
            <boxGeometry args={[0.05, 0.028, 0.9]} />
          </mesh>

          {/* Forward strut */}
          <mesh
            material={MATERIALS.steel}
            position={[0, 0.115, 0.3]}
            rotation={[0.22, 0, 0]}
          >
            <cylinderGeometry args={[0.021, 0.021, 0.24, 12]} />
          </mesh>

          {/* Aft strut */}
          <mesh
            material={MATERIALS.steel}
            position={[0, 0.115, -0.3]}
            rotation={[-0.22, 0, 0]}
          >
            <cylinderGeometry args={[0.021, 0.021, 0.24, 12]} />
          </mesh>
        </group>
      ))}

      {/* ============================================================ */}
      {/* HULL DETAILING                                               */}
      {/* ============================================================ */}

      {/* Panel lines */}
      {[-0.34, 0.34].map((z) => (
        <mesh
          key={z}
          position={[0, 0.115, z]}
          rotation={[-Math.PI / 2, 0, 0]}
          raycast={() => null}
        >
          <planeGeometry args={[1.5, 0.012]} />
          <meshBasicMaterial color="#3d444d" transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Side vent grilles */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.86, 0.03, 0]}>
          {[-0.16, -0.05, 0.06, 0.17].map((y) => (
            <mesh
              key={y}
              material={MATERIALS.steel}
              position={[0, y, 0]}
              raycast={() => null}
            >
              <boxGeometry args={[0.014, 0.022, 0.3]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Serial plate */}
      <mesh
        material={MATERIALS.chrome}
        position={[-0.62, 0.16, 0.36]}
        rotation={[-Math.PI / 2, 0, 0.4]}
        raycast={() => null}
      >
        <planeGeometry args={[0.16, 0.06]} />
      </mesh>
    </group>
  );
}

/* Keep THREE referenced for tree-shaking clarity in strict builds. */
export type DroneThreeNamespace = typeof THREE;