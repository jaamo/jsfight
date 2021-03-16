import {
  Mesh,
  LineBasicMaterial,
  Line,
  BufferGeometry,
  BufferAttribute,
} from "three";
import { IObstacle } from "../interfaces/interfaces";

export class Obstacle extends Mesh {
  constructor(obstacle: IObstacle) {
    super();

    // Define material
    const material: LineBasicMaterial = new LineBasicMaterial({
      color: 0xffffff,
    });

    // Define and set vertices
    const obstacleGeometry: BufferGeometry = new BufferGeometry();
    const obstacleVertices = new Float32Array([
      obstacle.startX,
      5,
      obstacle.startY,
      obstacle.endX,
      5,
      obstacle.endY,
    ]);
    obstacleGeometry.setAttribute(
      "position",
      new BufferAttribute(obstacleVertices, 3)
    );

    // Create line
    const obstacleLine = new Line(obstacleGeometry, material);
    this.add(obstacleLine);
  }
}
