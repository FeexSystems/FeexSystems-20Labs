# Knowledge Galaxy HQ (`/world`)

High-quality 3D World Model projection built on `@react-three/fiber` + `@react-three/drei`.

## Modules

| Path | Role |
|------|------|
| `client/pages/SpatialWorld.tsx` | Page shell, HUD, quality selector |
| `client/components/galaxy/GalaxyScene.tsx` | Lights, stars, grid, camera, nodes/links |
| `client/components/galaxy/WorldNode.tsx` | Planetary cores, LOD, drift |
| `client/components/galaxy/Conduit.tsx` | Arched relationship beams + trails |
| `client/components/galaxy/layout.ts` | Force-directed orbital layout |
| `client/components/galaxy/GalaxyEffects.tsx` | Bloom / vignette / CA (optional) |
| `client/components/webgl/PlanetaryCoreMaterial.tsx` | GLSL planetary shaders |

## Quality tiers

| Tier | Bloom | Transmission | Stars | Use |
|------|-------|--------------|-------|-----|
| **Cinematic** | Yes + vignette | High samples | 6k | Desktop high-end |
| **Balanced** | Yes | Medium | 3.5k | Default |
| **Performance** | No | Off | 1.5k | Mobile / low GPU |

Default is auto-detected from `hardwareConcurrency` / `deviceMemory`.

## Layout

Force simulation pulls **technologies** inward and **projects** outward, with springs along `USES` links so related worlds cluster. Nodes receive a light continuous drift so the galaxy feels alive.

## LOD

Distance from camera:

- Near — full planetary stack (shader, atmosphere, lattice, rings)
- Mid — labels + core
- Far — simplified geometry / fewer decorations

## Postprocessing

Install for full HQ look:

```bash
npm i @react-three/postprocessing postprocessing
```

Without these packages, `GalaxyEffects` no-ops and the scene still runs.

## Data

Live graph: `GET /api/world-model/graph`  
Fallback: canonical FeexSystems showcase graph embedded in the page.

Node radius scales with `artifactCount`, `val`, and pinned status.
