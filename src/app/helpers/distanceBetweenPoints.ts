export function distanceBetweenPoints(
  ax: number,
  ay: number,
  bx: number,
  by: number
): number {
  return Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2));
}
