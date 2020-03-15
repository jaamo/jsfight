export interface IRobot {
  tick(state: IGameState): IRobotOutput;
  getName(): string;
}

export interface IGameState {
  robots: Array<IRobotState>;
  bulletTrails: Array<IBulletTrail>;
  obstables: Array<IObstacle>;
  powerUps: Array<IPowerUp>;
}

export interface IObstacle {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface IRobotState {
  name: string;
  radius: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  gunShoot: boolean;
  gunCooldown: number;
  health: number;
  robotId: number;
}

export interface IPowerUp {
  id: number;
  x: number;
  y: number;
  lifetime: number;
  type: PowerUpType;
}

export enum PowerUpType {
  FullHealth = 1
}

export interface IRobotOutput {
  accelerate: boolean;
  reverse: boolean;
  left: boolean;
  right: boolean;
  gunShoot: boolean;
}

export interface IBulletTrail {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  robotId: number;
}

export interface ICollisionResult {
  collision: boolean; // True if collides
  point?: ICollisionPoint;
}

export interface ICollisionPoint {
  x?: number;
  y?: number;
  dist?: number;
  collides?: boolean;
}
