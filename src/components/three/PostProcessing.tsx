import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';

interface PostProcessingProps {
  /** When false the composer is skipped entirely (low-power devices). */
  enabled: boolean;
}

/**
 * Deliberately restrained post stack.
 * Bloom threshold is high enough that only the pink accents and the brightest
 * LED pixels bleed — the drone itself stays crisp.
 */
export function PostProcessing({ enabled }: PostProcessingProps) {
  if (!enabled) return null;

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.62}
        luminanceThreshold={0.62}
        luminanceSmoothing={0.28}
        mipmapBlur
        radius={0.7}
      />
      <Vignette offset={0.3} darkness={0.66} />
    </EffectComposer>
  );
}