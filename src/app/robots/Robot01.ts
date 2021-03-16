import { IGameState, IRobot, IRobotOutput } from "../interfaces/interfaces";

export default class Robot implements IRobot {
  private output: IRobotOutput = {
    accelerate: false,
    reverse: false,
    left: false,
    right: false,
    gunShoot: false,
  };

  constructor() {
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      // console.log(e.keyCode);
      if (e.keyCode == 87) this.output.accelerate = true;
      if (e.keyCode == 83) this.output.reverse = true;
      if (e.keyCode == 65) this.output.left = true;
      if (e.keyCode == 68) this.output.right = true;
      if (e.keyCode == 32) this.output.gunShoot = true;
    });
    document.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.keyCode == 87) this.output.accelerate = false;
      if (e.keyCode == 83) this.output.reverse = false;
      if (e.keyCode == 65) this.output.left = false;
      if (e.keyCode == 68) this.output.right = false;
      if (e.keyCode == 32) this.output.gunShoot = false;
    });
  }

  tick(state: IGameState): IRobotOutput {
    return this.output;
  }

  getName(): string {
    return "BOT1";
  }
}
