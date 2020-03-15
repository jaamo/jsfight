import { IGameState, IRobot, IRobotOutput } from "../interfaces/gameState";

export default class Robot implements IRobot {
  tick(state: IGameState): IRobotOutput {
    const controls: IRobotOutput = {
      accelerate: false,
      reverse: false,
      left: true,
      right: false,
      gunShoot: true
    };
    return controls;
  }
  getName(): string {
    return "BOT2";
  }
}
