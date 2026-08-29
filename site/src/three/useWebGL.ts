/*
 * useWebGL - capability detection for the 3D layer.
 *
 * 3D is progressive enhancement (spec §1): WebGL-unsupported browsers get
 * the existing 2D/SVG scene. Returns false in jsdom (tests exercise the
 * 2D fallback path).
 */
import { useState } from 'react';

export function useWebGL(): boolean {
  const [supported] = useState<boolean>(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      return Boolean(gl);
    } catch {
      return false;
    }
  });
  return supported;
}
