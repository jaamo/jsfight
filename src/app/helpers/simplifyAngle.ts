/**
 * By default threejs allows any value as an angle and it just calculates
 * amount of full rotations and then the full angle. To simplify robots we
 * convert angle to be always positive and max 2 * PI.
 */
export function simplifyAngle(rads: number): number {
  const capped: number = rads % (2 * Math.PI);
  return capped < 0 ? 2 * Math.PI + capped : capped;
}
