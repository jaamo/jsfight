import {
  Mesh,
  LineBasicMaterial,
  BufferGeometry,
  Line,
  BufferAttribute,
} from "three";

export class Axis extends Mesh {
  constructor() {
    super();

    // X axis (red)
    const lineRedMaterial: LineBasicMaterial = new LineBasicMaterial({
      color: 0xff0000,
    });
    const xAxisGeometry: BufferGeometry = new BufferGeometry();
    const xAxisVertices = new Float32Array([0, 0, 0, 500, 0, 0]);
    xAxisGeometry.setAttribute(
      "position",
      new BufferAttribute(xAxisVertices, 3)
    );
    const xAxis = new Line(xAxisGeometry, lineRedMaterial);
    this.add(xAxis);

    // Y axis (green)
    const lineGreenMaterial: LineBasicMaterial = new LineBasicMaterial({
      color: 0x00ff00,
    });
    const yAxisGeometry: BufferGeometry = new BufferGeometry();
    const yAxisVertices = new Float32Array([0, 0, 0, 0, 500, 0]);
    yAxisGeometry.setAttribute(
      "position",
      new BufferAttribute(yAxisVertices, 3)
    );
    const yAxis = new Line(yAxisGeometry, lineGreenMaterial);
    this.add(yAxis);

    // Y axis (green)
    const lineBlueMaterial: LineBasicMaterial = new LineBasicMaterial({
      color: 0x0000ff,
    });
    const zAxisGeometry: BufferGeometry = new BufferGeometry();
    const zAxisVertices = new Float32Array([0, 0, 0, 0, 0, 500]);
    zAxisGeometry.setAttribute(
      "position",
      new BufferAttribute(zAxisVertices, 3)
    );
    const zAxis = new Line(zAxisGeometry, lineBlueMaterial);
    this.add(zAxis);
  }
}
