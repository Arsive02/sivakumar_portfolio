let cached: boolean | undefined
export function hasWebGL2() {
  if (cached !== undefined) return cached
  try {
    cached = !!document.createElement('canvas').getContext('webgl2')
  } catch {
    cached = false
  }
  return cached
}
