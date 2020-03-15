import { ICollisionResult, IObstacle } from "../interfaces/gameState";
import { distanceBetweenPoints } from "./distanceBetweenPoints";
import { detectLineLineCollision } from "./detectLineLineCollission";

/**
 * Helper function to detect if line collides with any of the given obstacles.
 * Closest collision point is returned.
 *
 * Returns object ICollisionResult
 *
 */
export function detectLineObstaclesCollision(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  obstacles: Array<IObstacle>
): ICollisionResult {
  // Get colliding obstacles.
  const collidingResults: Array<ICollisionResult> = [];
  obstacles.map((obstacle: IObstacle) => {
    const collision: ICollisionResult = detectLineLineCollision(
      x1,
      y1,
      x2,
      y2,
      obstacle.startX,
      obstacle.startY,
      obstacle.endX,
      obstacle.endY
    );
    if (collision.collision) {
      collidingResults.push(collision);
    }
  });

  // No collision.
  if (collidingResults.length == 0) {
    return { collision: false };
  }
  // Only single collision.
  else if (collidingResults.length == 1) {
    return collidingResults[0];
  }
  // Get the closest collision.
  else {
    collidingResults.sort(
      (result1: ICollisionResult, result2: ICollisionResult) => {
        if (
          typeof result1 != "undefined" &&
          typeof result2 != "undefined" &&
          typeof result1.point != "undefined" &&
          typeof result2.point != "undefined" &&
          typeof result1.point.dist != "undefined" &&
          typeof result2.point.dist != "undefined"
        ) {
          return result1.point.dist - result2.point.dist;
        } else {
          return 0;
        }
      }
    );
    return collidingResults[0];
  }
}
