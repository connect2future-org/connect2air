import { Suspense, useLayoutEffect, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Lighting } from './Lighting';
import { HeroDrone } from './HeroDrone';
import { PostProcessing } from './PostProcessing';
import { useResponsive3D } from '../../hooks/useResponsive3D';

interface SceneProps {
  /** Tune framing for an inline hero panel instead of full-screen. */
  contained?: boolean;
}

function CameraRig({ contained }: { contained: boolean }) {
  const camera = useThree((state) => state.camera);
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);

  useLayoutEffect(() => {
    const perspective = camera as THREE.PerspectiveCamera;

    /* ----------------------------------------------------------------
     * WEBSITE HERO TUNING
     *
     * The drone + suspended LED banner is ~5.6 units tall end-to-end.
     * TARGET_HEIGHT is deliberately set to 6.8 so the whole formation
     * fits with a small margin above and below — no more cut-offs.
     *
     *  TARGET_HEIGHT  higher → smaller drone (more margin)
     *  TARGET_WIDTH   higher → smaller drone (more side margin)
     *  TARGET_Y       lower  → drone moves UP on screen
     *  TARGET_X       higher → drone moves LEFT on screen
     * ---------------------------------------------------------------- */
    const TARGET_HEIGHT = contained ? 6.8 : 6.2;
    const TARGET_WIDTH  = contained ? 3.8 : 4.6;
    const TARGET_Y      = contained ? 0.10 : 0.45;
    const TARGET_X      = contained ? 0.45 : 0;

    const aspect = height > 0 ? width / height : 1;
    const vFov = (perspective.fov * Math.PI) / 180;

    const distanceForHeight = TARGET_HEIGHT / 2 / Math.tan(vFov / 2);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const distanceForWidth = TARGET_WIDTH / 2 / Math.tan(hFov / 2);

    const distance = Math.max(distanceForHeight, distanceForWidth);

    perspective.position.set(TARGET_X, TARGET_Y + 0.4, distance);
    perspective.lookAt(TARGET_X, TARGET_Y, 0);
    perspective.updateProjectionMatrix();
  }, [camera, width, height, contained]);

  return null;
}

export function Scene({ contained = false }: SceneProps) {
  const { dpr, postProcessing } = useResponsive3D();

  const cameraOptions = useMemo(
    () => ({
      position: [0, 0.85, 9.4] as [number, number, number],
      fov: 34,
      near: 0.1,
      far: 120,
    }),
    [],
  );

  return (
    <Canvas
      dpr={[1, dpr]}
      camera={cameraOptions}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        // Transparent so the website's own hero background shows through.
        gl.setClearColor(0x000000, 0);
      }}
    >
      <CameraRig contained={contained} />

      <Suspense fallback={null}>
        <Lighting />
        <HeroDrone />
      </Suspense>

      <PostProcessing enabled={postProcessing} />
    </Canvas>
  );
}