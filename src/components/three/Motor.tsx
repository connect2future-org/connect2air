import { useMemo } from 'react';
import * as THREE from 'three';
import { MATERIALS } from '../../utils/materials';
import { DRONE } from '../../utils/constants';
import { Propeller } from './Propeller';

interface MotorProps {
  position: [number, number, number];
  rotationY: number;
  /** Counter-rotating pairs look more believable. */
  reversed?: boolean;
}

const FIN_COUNT = 12;

/**
 * A complete propulsion unit: mount plate, finned stator, chrome cap,
 * emissive pink ring light and the propeller on top.
 */
export function Motor({ position, rotationY, reversed = false }: MotorProps) {
  const fins = useMemo(
    () =>
      Array.from({ length: FIN_COUNT }, (_, index) => {
        const angle = (index / FIN_COUNT) * Math.PI * 2;
        return {
          angle,
          position: [
            Math.cos(angle) * 0.188,
            0.045,
            Math.sin(angle) * 0.188,
          ] as [number, number, number],
        };
      }),
    [],
  );

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Arm-tip mount plate */}
      <mesh material={MATERIALS.graphite} position={[0, -0.035, 0]}>
        <cylinderGeometry args={[0.2, 0.225, 0.055, 26]} />
      </mesh>

      {/* Stator body */}
      <mesh material={MATERIALS.hullDark} position={[0, 0.045, 0]}>
        <cylinderGeometry args={[0.176, 0.198, 0.135, 30]} />
      </mesh>

      {/* Cooling fins */}
      {fins.map((fin, index) => (
        <mesh
          key={index}
          material={MATERIALS.steel}
          position={fin.position}
          rotation={[0, -fin.angle, 0]}
        >
          <boxGeometry args={[0.036, 0.1, 0.012]} />
        </mesh>
      ))}

      {/* Chrome motor cap */}
      <mesh material={MATERIALS.chrome} position={[0, 0.118, 0]}>
        <cylinderGeometry args={[0.1, 0.152, 0.05, 26]} />
      </mesh>

      {/* Emissive pink ring */}
      <mesh
        material={MATERIALS.pink}
        position={[0, 0.146, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[0.118, 0.0085, 8, 34]} />
      </mesh>

      {/* Propeller */}
      <Propeller
        y={0.176}
        radius={DRONE.propRadius}
        speed={DRONE.propSpeed}
        reversed={reversed}
      />
    </group>
  );
}