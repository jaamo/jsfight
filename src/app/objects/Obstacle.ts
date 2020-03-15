import { Mesh, LineBasicMaterial, Geometry, Line, Vector3 } from "three";
import { IObstacle } from "../interfaces/gameState";

export class Obstacle extends Mesh {
  constructor(obstacle: IObstacle) {
    super();

    const material: LineBasicMaterial = new LineBasicMaterial({
      color: 0xffffff
    });
    const obstacleGeometry: Geometry = new Geometry();
    obstacleGeometry.vertices.push(
      new Vector3(obstacle.startX, 5, obstacle.startY),
      new Vector3(obstacle.endX, 5, obstacle.endY)
    );
    const obstacleLine = new Line(obstacleGeometry, material);
    this.add(obstacleLine);
  }
}
