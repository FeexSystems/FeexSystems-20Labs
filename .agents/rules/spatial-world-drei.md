---
trigger: glob
description: Architectural standards and declarative conventions for @react-three/drei and 3D WebGL spatial scenes in FeexSystems
globs: client/**/*.{ts,tsx}
---

# FeexSystems Spatial 3D & `@react-three/drei` Architecture Standards

When developing, extending, or maintaining 3D WebGL components in `client/` (especially `/world`, `SpatialWorld.tsx`, and WebGL background components):

1. **Declarative Navigation via `CameraControls`**:
   - Always use `CameraControls` from `@react-three/drei` with the `makeDefault` prop.
   - Programmatic focus transitions must use `cameraControlsRef.current.setLookAt(camX, camY, camZ, targetX, targetY, targetZ, true)` with smooth damping.
   - Maintain auto-rotation via `cameraControlsRef.current.azimuthAngle += rate * delta` in `useFrame` when no node is selected.

2. **Spatial Chrome & Orientation**:
   - Include `<GizmoHelper>` and `<GizmoViewport>` in the bottom-right corner using canonical FeexSystems brand colors (`#00F5D4` Phosphor Cyan, `#00FFA3` Terminal Emerald, `#7B2CBF` Quantum Violet).
   - Anchor spatial scenes with an infinite `<Grid>` positioned below the node galaxy with camera-following fade (`fadeDistance`, `fadeStrength`, `fadeFrom={1}`).

3. **Mesh Selection Feedback via `Edges` and `Outlines`**:
   - Nest `<Edges>` inside geometry for wireframe illumination upon hover/selection (`threshold={15}`, `linewidth={2}`).
   - Nest `<Outlines>` inside meshes for inverted-hull silky glow halos on pinned/primary worlds (`screenspace={false}`).
   - Preserve custom GLSL procedural shaders (`PlanetaryCoreShaderMaterial`, `AtmosphereHalo`) rather than replacing them with generic standard materials.

4. **Connection Link Telemetry via `Trail`**:
   - Render animated data-flow pulses along active relationships using `@react-three/drei` `<Trail>` wrapping a lerped vector sphere.

5. **Branded Loading States**:
   - Place `@react-three/drei` `<Loader />` alongside the canvas container with glassmorphic obsidian styling and phosphor cyan progress telemetry.
