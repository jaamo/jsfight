import { ICollisionResult } from "../interfaces/public";
import { distanceBetweenPoints } from "./distanceBetweenPoints";

/**
 * Check if given circles collide.
 *
 * Returns object ICollisionResult.
 *
 * Colliding point is never calculated.
 */
export function detectCircleCircleCollision(
  circle1x: number,
  circle1y: number,
  circle1r: number,
  circle2x: number,
  circle2y: number,
  circle2r: number
): ICollisionResult {
  const dist: number = distanceBetweenPoints(
    circle1x,
    circle1y,
    circle2x,
    circle2y
  );

  if (dist < circle1r + circle2r) {
    return { collision: true };
  } else {
    return { collision: false };
  }
}
