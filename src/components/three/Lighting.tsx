import { Environment, Lightformer } from '@react-three/drei';
import { BRAND } from '../../utils/constants';

/**
 * Professional product-render lighting.
 *
 * - key / fill / rim directional lights keep the dark metallic surfaces readable
 * - a fully procedural <Environment> (built from Lightformers, rendered once)
 *   supplies the reflections that make the metal look like real metal
 * - a restrained pink accent keeps Connect2Air present without washing the model
 */
export function Lighting() {
  return (
    <>
      {/* Ambient floor so pure-black areas still have a value. */}
      <ambientLight intensity={0.16} color="#7f8ea3" />

      {/* Key light — soft white, upper front right. */}
      <directionalLight
        position={[5.5, 7.5, 6]}
        intensity={2.35}
        color="#ffffff"
      />

      {/* Fill light — cool grey, left. */}
      <directionalLight
        position={[-7, 3, 4]}
        intensity={0.85}
        color="#9fb6cf"
      />

      {/* Rim light — from behind, separates the silhouette. */}
      <directionalLight
        position={[-2.5, 4.5, -8]}
        intensity={1.25}
        color="#cfd9e6"
      />

      {/* Subtle magenta accent from below / behind. */}
      <directionalLight
        position={[0.5, -5, -7]}
        intensity={0.9}
        color={BRAND.pink}
      />

      {/* Subtle local accent light near the drone legs. */}
      <pointLight
        position={[0, -1.8, 2.5]}
        intensity={0.4}
        distance={6}
        decay={2}
        color={BRAND.pinkSoft}
      />

      {/*
        Procedural environment map — no network requests, no paid HDRIs.
        `frames={1}` renders the light-formers a single time into a cube RT.
      */}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#050506']} />

        {/* Large white softbox, above / in front. */}
        <Lightformer
          form="rect"
          intensity={5}
          color="#ffffff"
          position={[0, 6, 6]}
          rotation={[-Math.PI / 3, 0, 0]}
          scale={[12, 8, 1]}
        />

        {/* Left wall — cool grey bounce. */}
        <Lightformer
          form="rect"
          intensity={2.1}
          color="#cfd8e3"
          position={[-8, 2, 2]}
          rotation={[0, Math.PI / 2.4, 0]}
          scale={[10, 10, 1]}
        />

        {/* Right wall — darker steel bounce. */}
        <Lightformer
          form="rect"
          intensity={1.5}
          color="#8fa6c0"
          position={[8, 2, -2]}
          rotation={[0, -Math.PI / 2.4, 0]}
          scale={[10, 10, 1]}
        />

        {/* Magenta back accent. */}
        <Lightformer
          form="rect"
          intensity={2.4}
          color={BRAND.pink}
          position={[0, -2, -7]}
          rotation={[Math.PI / 2.6, 0, 0]}
          scale={[8, 4, 1]}
        />

        {/* Top circle — crisp highlight streaks on the chrome. */}
        <Lightformer
          form="circle"
          intensity={3.2}
          color="#ffffff"
          position={[0, 8, -2]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[6, 6, 1]}
        />
      </Environment>
    </>
  );
}