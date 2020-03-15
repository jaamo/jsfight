import { IJSFightMap, IObstacle } from "../interfaces/interfaces";

export class MapGenerator {
  getRandomMap(): IJSFightMap {
    const map: IJSFightMap = { obstacles: [], powerUpLocations: [] };

    // Side walls
    const wall01: IObstacle = {
      startX: 0,
      startY: 0,
      endX: 1000,
      endY: 0
    };
    const wall02: IObstacle = {
      startX: 1000,
      startY: 0,
      endX: 1000,
      endY: 1000
    };
    const wall03: IObstacle = {
      startX: 1000,
      startY: 1000,
      endX: 0,
      endY: 1000
    };
    const wall04: IObstacle = {
      startX: 0,
      startY: 1000,
      endX: 0,
      endY: 0
    };

    // Walls in the middle.
    const middleWall01: IObstacle = {
      startX: 300,
      startY: 200,
      endX: 300,
      endY: 800
    };
    const middleWall02: IObstacle = {
      startX: 700,
      startY: 200,
      endX: 700,
      endY: 800
    };

    // Create list.
    map.obstacles.push(wall01);
    map.obstacles.push(wall02);
    map.obstacles.push(wall03);
    map.obstacles.push(wall04);
    map.obstacles.push(middleWall01);
    map.obstacles.push(middleWall02);

    return map;
  }
}
