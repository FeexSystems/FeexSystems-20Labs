import type { GalaxyQuality } from "./types";

/**
 * Optional post stack. Loads @react-three/postprocessing when installed;
 * otherwise no-ops so the scene still runs.
 */
export function GalaxyEffects({ quality: _quality }: { quality: GalaxyQuality }) {
  // Post-processing stack is optional and disabled in standard/mobile builds
  // To avoid ESM bundle failures with dynamic require, return null gracefully.
  return null;
}
