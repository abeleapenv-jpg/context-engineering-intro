/*
 * QUIETFIELD 3D LIGHTING & RENDERER SETUP
 *
 * Locked parameters (Amendment A):
 *   - ACESFilmicToneMapping, exposure 0.85 (no blown-out white; the
 *     cream figures roll off into warm grey at the highlights)
 *   - FogExp2 in ink (#1e1e17, density 0.04) for depth and stage
 *     isolation (token-derived; pure `0x0e1117` replaced per §3.6.1 #4)
 *   - PCFSoftShadowMap for the key light's soft shadows
 *   - Rig: ambient fill 0.35 (static) + directional key casting soft
 *     shadows + cold tan-tinted rim/backlight 0.6 (static, no shadow)
 *
 * Spec budget (§3): one dynamic light per scene. Read as ONE
 * SHADOW-CASTING light (the key). Ambient and rim are static fills with
 * no shadow work, in the spirit of "bake or fake secondary lighting".
 */
import * as THREE from 'three';

import { FOG, TOKENS } from '../lib/tokens';

export const RENDERER = {
  toneMapping: THREE.ACESFilmicToneMapping,
  toneMappingExposure: 0.85,
  /** PCF soft shadows under the single key light. */
  shadowMapType: THREE.PCFSoftShadowMap,
  clearColor: TOKENS.ink,
} as const;

export const LIGHTING = {
  ambientIntensity: 0.35,
  keyIntensity: 1.4,
  rimIntensity: 0.6,
  /** Cream-colored light keeps the whole rig warm and token-bound. */
  keyColor: TOKENS.cream,
  ambientColor: TOKENS.cream,
  /** Tan-tinted rim reads cold next to the warm key (temperature shift
   *  layered on the ink/cream base, spec §3.5). */
  rimColor: TOKENS.tan,
} as const;

export interface RendererLike {
  toneMapping?: THREE.ToneMapping;
  toneMappingExposure?: number;
  shadowMap?: { enabled?: boolean; type?: THREE.ShadowMapType };
  setClearColor?: (color: THREE.ColorRepresentation) => void;
}

/** Applies tone mapping, exposure, soft shadows, ink clear color, and
 *  scene fog. Idempotent, safe to call from R3F's onCreated. */
export function setupRenderer(gl: RendererLike, scene: THREE.Scene): void {
  gl.toneMapping = RENDERER.toneMapping;
  gl.toneMappingExposure = RENDERER.toneMappingExposure;
  if (gl.shadowMap) {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = RENDERER.shadowMapType;
  }
  gl.setClearColor?.(RENDERER.clearColor);
  scene.fog = new THREE.FogExp2(FOG.color, FOG.density);
}

export interface Rig {
  ambient: THREE.AmbientLight;
  key: THREE.DirectionalLight;
  rim: THREE.DirectionalLight;
}

/** The cinematic rig. Only the key casts shadows (budget rule). */
export function buildLights(): Rig {
  const ambient = new THREE.AmbientLight(LIGHTING.ambientColor, LIGHTING.ambientIntensity);

  const key = new THREE.DirectionalLight(LIGHTING.keyColor, LIGHTING.keyIntensity);
  key.position.set(4.5, 7.5, 5.5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 40;
  key.shadow.camera.left = -9;
  key.shadow.camera.right = 9;
  key.shadow.camera.top = 9;
  key.shadow.camera.bottom = -9;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;

  // Cold, subtle rim from behind: carves silhouettes off the dark field.
  const rim = new THREE.DirectionalLight(LIGHTING.rimColor, LIGHTING.rimIntensity);
  rim.position.set(-4.5, 3.2, -5.5);
  rim.castShadow = false;

  return { ambient, key, rim };
}
