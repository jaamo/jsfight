import { ICollisionResult } from "../interfaces/gameState";
import { distanceBetweenPoints } from "./distanceBetweenPoints";

/**
 * Check if given two lines collide. Return intersction point.
 *
 * Returns object ICollisionResult
 *
 * References:
 * line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
 */
export function detectLineLineCollision(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number
): ICollisionResult {
  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return { collision: false };
  }

  const denominator: number = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  // Lines are parallel
  if (denominator === 0) {
    return { collision: false };
  }

  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return { collision: false };
  }

  // Return a object with the x and y coordinates of the intersection
  let x = x1 + ua * (x2 - x1);
  let y = y1 + ua * (y2 - y1);

  // Calculate distance.
  const dist: number = distanceBetweenPoints(x1, y1, x, y);

  return {
    collision: true,
    point: { x: x, y: y, dist: dist }
  };
}
