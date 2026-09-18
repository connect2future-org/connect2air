import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MATERIALS } from '../../utils/materials';

interface PropellerProps {
  /** Blade radius. */
  radius?: number;
  /** Number of blades. */
  blades?: number;
  /** Rotation speed in radians / second. */
  speed?: number;
  /** Local Y offset inside the motor assembly. */
  y?: number;
  /** Spin the other way (counter-rotating pairs). */
  reversed?: boolean;
}

/**
 * One propeller system: tapered extruded blades on a chrome hub.
 * Rotation is applied on the group inside useFrame — nothing is allocated
 * per frame.
 */
export function Propeller({
  radius = 0.62,
  blades = 3,
  speed = 27,
  y = 0,
  reversed = false,
}: PropellerProps) {
  const spinRef = useRef<THREE.Group>(null);

  const bladeGeometry = useMemo(() => {
    const r = radius;

    const shape = new THREE.Shape();
    shape.moveTo(0.07 * r, -0.052 * r);
    shape.bezierCurveTo(0.32 * r, -0.094 * r, 0.72 * r, -0.076 * r, 0.965 * r, -0.024 * r);
    shape.lineTo(1.0 * r, 0);
    shape.bezierCurveTo(0.72 * r, 0.076 * r, 0.32 * r, 0.094 * r, 0.07 * r, 0.052 * r);
    shape.closePath();

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.009,
      bevelEnabled: true,
      bevelSize: 0.004,
      bevelThickness: 0.003,
      bevelSegments: 2,
      curveSegments: 14,
    });

    // Lay the blade flat (span on X, thickness on Y) and centre the thickness.
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(0, 0.0045, 0);
    geometry.computeVertexNormals();

    return geometry;
  }, [radius]);

  useFrame((_state, delta) => {
    const group = spinRef.current;
    if (!group) return;

    // Clamp dt so a tab-switch can never make the props jump.
    const dt = Math.min(delta, 1 / 30);
    group.rotation.y += dt * speed * (reversed ? -1 : 1);

    if (group.rotation.y > Math.PI * 2) {
      group.rotation.y -= Math.PI * 2;
    } else if (group.rotation.y < -Math.PI * 2) {
      group.rotation.y += Math.PI * 2;
    }
  });

  const bladeStep = (Math.PI * 2) / blades;

  return (
    <group position={[0, y, 0]}>
      <group ref={spinRef}>
        {Array.from({ length: blades }, (_, index) => (
          <group key={index} rotation={[0, index * bladeStep, 0]}>
            <mesh
              geometry={bladeGeometry}
              material={MATERIALS.blade}
              rotation={[0.24, 0, 0]}
              raycast={() => null}
            />
          </group>
        ))}
      </group>

      {/* Hub */}
      <mesh material={MATERIALS.chrome} raycast={() => null}>
        <sphereGeometry args={[0.055, 18, 12]} />
      </mesh>

      {/* Hub collar */}
      <mesh
        material={MATERIALS.graphite}
        position={[0, 0.032, 0]}
        raycast={() => null}
      >
        <cylinderGeometry args={[0.046, 0.062, 0.05, 18]} />
      </mesh>
    </group>
  );
}