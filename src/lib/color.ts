export type NormalizedRGB = [number, number, number]

export function hexToNormalizedRGB(hex: string): NormalizedRGB {
  const clean = hex.replace('#', '')
  return [
    parseInt(clean.slice(0, 2), 16) / 255,
    parseInt(clean.slice(2, 4), 16) / 255,
    parseInt(clean.slice(4, 6), 16) / 255,
  ]
}
