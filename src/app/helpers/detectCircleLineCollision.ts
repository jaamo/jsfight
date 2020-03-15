import { distanceBetweenPoints } from "./distanceBetweenPoints";
import { ICollisionResult, ICollisionPoint } from "../interfaces/public";

/**
 * Check if given circle collides with given line.
 *
 * Circle is defined with radius (r) and position (cx, cy).
 *
 * Line is defined with two points ax, ay and bx, by.
 *
 * Returns object ICollisionResult
 *
 * References:
 * https://stackoverflow.com/a/1088058
 * https://i.stack.imgur.com/P556i.png
 */
export function detectCircleLineCollision(
  cx: number,
  cy: number,
  r: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
): ICollisionResult {
  // Compute the euclidean distance between A and B.
  const lab: number = distanceBetweenPoints(bx, by, ax, ay);

  // compute the direction vector D from A to B
  const dx: number = (bx - ax) / lab;
  const dy: number = (by - ay) / lab;

  // The equation of the line AB is x = Dx*t + Ax, y = Dy*t + Ay with 0 <= t <= LAB.

  // Compute the distance between the points A and E, where
  // E is the point of AB closest the circle center (Cx, Cy)
  const t: number = dx * (cx - ax) + dy * (cy - ay);

  // Compute the coordinates of the point E.
  const ex: number = t * dx + ax;
  const ey: number = t * dy + ay;

  // Compute the euclidean distance between E and C.
  const lec: number = distanceBetweenPoints(ex, ey, cx, cy);

  // Test if the line intersects the circle.

  // Line is inside the circle. Two intersections.
  if (lec < r) {
    // Compute distance from t to circle intersection point.
    const dt: number = Math.sqrt(Math.pow(r, 2) - Math.pow(lec, 2));

    // Calculate intersection points.
    const f = {
      x: (t - dt) * dx + ax,
      y: (t - dt) * dy + ay,
      dist: 0,
      collides: false
    };
    const g = {
      x: (t + dt) * dx + ax,
      y: (t + dt) * dy + ay,
      dist: 0,
      collides: false
    };

    // Calculate distances to collision points.
    f.dist = distanceBetweenPoints(ax, ay, f.x, f.y);
    g.dist = distanceBetweenPoints(ax, ay, g.x, g.y);

    // Get boolean flags if colliding points are on the live.
    f.collides = point_inside_box(f.x, f.y, ax, ay, bx, by);
    g.collides = point_inside_box(g.x, g.y, ax, ay, bx, by);

    // Create points array.
    const points = [f, g];

    // Filter only colliding points.
    const colliding_points: Array<ICollisionPoint> = points.filter(
      point => point.collides
    );

    // Colliding points are not inside the line. No collision.
    if (colliding_points.length == 0) {
      return { collision: false };
    }
    // Collision! Return collision with closes colliding point.
    else {
      const closestPoint: ICollisionPoint = colliding_points.reduce(
        (acc: ICollisionPoint, point: ICollisionPoint) => {
          if (typeof acc.dist === "undefined") {
            return point;
          } else if (point && point.dist && point.dist < acc.dist) {
            return point;
          } else {
            return acc;
          }
        },
        {}
      );
      return { collision: true, point: closestPoint };
    }
  }
  // Else test if the line is tangent to circle. Tangent point is E.
  // Test if the point is on the line (A to B).
  else if (lec == r && point_inside_box(ex, ey, ax, ay, bx, by)) {
    return {
      collision: true,
      point: {
        x: ex,
        y: ey,
        dist: distanceBetweenPoints(cx, cy, ex, ey),
        collides: true
      }
    };
  }
  // Line doesn't touch circle.
  else {
    return { collision: false };
  }
}

/**
 * Return true if given point p is inside a rectange defined by points a and b.
 */
function point_inside_box(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
): boolean {
  return (
    px >= Math.min(ax, bx) &&
    px <= Math.max(ax, bx) &&
    py >= Math.min(ay, by) &&
    py <= Math.max(ay, by)
  );
}
