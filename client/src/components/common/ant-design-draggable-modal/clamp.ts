export const clamp = (min: number, max: number, value: number): number =>
  Math.max(min, Math.min(max, value))
export const isTouchEvent = (e: MouseEvent | TouchEvent): e is TouchEvent =>
  e['touches']
export const isMixTouchEvent = (
  e: React.MouseEvent | React.TouchEvent
): e is React.TouchEvent => e['touches']
