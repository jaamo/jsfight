import { Mesh, LineBasicMaterial, Geometry, Line, Vector3 } from "three";

export class Axis extends Mesh {
  constructor() {
    super();

    // X axis (red)
    const lineRedMaterial: LineBasicMaterial = new LineBasicMaterial({
      color: 0xff0000
    });
    const xAxisGeometry: Geometry = new Geometry();
    xAxisGeometry.vertices.push(new Vector3(0, 0, 0), new Vector3(500, 0, 0));
    const xAxis = new Line(xAxisGeometry, lineRedMaterial);
    this.add(xAxis);

    // Y axis (green)
    const lineGreenMaterial: LineBasicMaterial = new LineBasicMaterial({
      color: 0x00ff00
    });
    const yAxisGeometry: Geometry = new Geometry();
    yAxisGeometry.vertices.push(new Vector3(0, 0, 0), new Vector3(0, 500, 0));
    const yAxis = new Line(yAxisGeometry, lineGreenMaterial);
    this.add(yAxis);

    // Y axis (green)
    const lineBlueMaterial: LineBasicMaterial = new LineBasicMaterial({
      color: 0x0000ff
    });
    const zAxisGeometry: Geometry = new Geometry();
    zAxisGeometry.vertices.push(new Vector3(0, 0, 0), new Vector3(0, 0, 500));
    const zAxis = new Line(zAxisGeometry, lineBlueMaterial);
    this.add(zAxis);
  }
}
