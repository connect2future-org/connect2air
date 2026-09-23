import { Bloom, EffectComposer } from '@react-three/postprocessing';

interface PostProcessingProps {
  /** When false the composer is skipped entirely (low-power devices). */
  enabled: boolean;
}

/**
 * Deliberately restrained post stack.
 * Vignette is removed so the 3D canvas blends 100% seamlessly into the page background
 * without creating a separate square outline or mismatched border box.
 */
export function PostProcessing({ enabled }: PostProcessingProps) {
  if (!enabled) return null;

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.25}
        luminanceThreshold={0.82}
        luminanceSmoothing={0.3}
        mipmapBlur
        radius={0.5}
      />
    </EffectComposer>
  );
}