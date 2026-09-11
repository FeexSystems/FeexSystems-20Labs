import { Suspense } from "react";
import type { GalaxyQuality } from "./types";
import { QUALITY_PRESETS } from "./types";

/**
 * Optional post stack. Loads @react-three/postprocessing when installed;
 * otherwise no-ops so the scene still runs.
 */
export function GalaxyEffects({ quality }: { quality: GalaxyQuality }) {
  const preset = QUALITY_PRESETS[quality];
  if (!preset.bloom) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { EffectComposer, Bloom, Vignette, ChromaticAberration } = require("@react-three/postprocessing");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { BlendFunction } = require("postprocessing");

    return (
      <Suspense fallback={null}>
        <EffectComposer multisampling={quality === "cinematic" ? 4 : 0}>
          <Bloom
            intensity={preset.bloomIntensity}
            luminanceThreshold={0.35}
            luminanceSmoothing={0.7}
            mipmapBlur
          />
          {quality === "cinematic" && (
            <>
              <Vignette eskil={false} offset={0.15} darkness={0.55} />
              <ChromaticAberration
                blendFunction={BlendFunction.NORMAL}
                offset={[0.0004, 0.0006]}
              />
            </>
          )}
        </EffectComposer>
      </Suspense>
    );
  } catch {
    return null;
  }
}
