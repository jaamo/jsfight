import React, { DOMElement } from "react";
import ReactDOM from "react-dom";
import { GameScene } from "./objects/GameScene";
import {
  IGameState,
  IRobot,
  IRobotOutput,
  IBulletTrail,
  IRobotState,
  IObstacle,
  ICollisionResult,
  PowerUpType,
  IPowerUp
} from "./interfaces/gameState";
import Robot01 from "./robots/Robot01";
import Robot02 from "./robots/Robot02";
import { detectCircleLineCollision } from "./helpers/detectCircleLineCollision";
import HUD from "./hud/Hud";
import { detectLineObstaclesCollision } from "./helpers/detectLineObstaclesCollision";
import { detectCircleCircleCollision } from "./helpers/detectCircleCircleCollision";
import { Vector2 } from "three";

export class App {
  private readonly game: GameScene;
  private gameState: IGameState;
  private robots: Array<IRobot> = [];
  private hudElement: HTMLElement | null = null;
  private powerUpCooldown: number = 1000;

  constructor() {
    this.gameState = {
      robots: [],
      bulletTrails: [],
      obstables: [],
      powerUps: []
    };

    // Init 3D scene.
    this.game = new GameScene();

    // Create robots.
    const robot01: Robot01 = new Robot01();
    this.robots.push(robot01);
    this.gameState.robots.push({
      radius: 20,
      x: 100,
      y: 500,
      speed: 0,
      angle: 0,
      gunShoot: false,
      gunCooldown: 0,
      name: robot01.getName(),
      health: 80,
      robotId: 1
    });
    const robot02: Robot02 = new Robot02();
    this.robots.push(robot02);
    this.gameState.robots.push({
      radius: 20,
      x: 900,
      y: 500,
      speed: 0,
      angle: 0,
      gunShoot: false,
      gunCooldown: 0,
      name: robot02.getName(),
      health: 80,
      robotId: 2
    });

    // Arena walls.
    const wall01: IObstacle = {
      startX: 0,
      startY: 0,
      endX: 1000,
      endY: 0
    };
    this.gameState.obstables.push(wall01);
    this.game.addObstacle(wall01);
    const wall02: IObstacle = {
      startX: 1000,
      startY: 0,
      endX: 1000,
      endY: 1000
    };
    this.gameState.obstables.push(wall02);
    this.game.addObstacle(wall02);
    const wall03: IObstacle = {
      startX: 1000,
      startY: 1000,
      endX: 0,
      endY: 1000
    };
    this.gameState.obstables.push(wall03);
    this.game.addObstacle(wall03);
    const wall04: IObstacle = {
      startX: 0,
      startY: 1000,
      endX: 0,
      endY: 0
    };
    this.gameState.obstables.push(wall04);
    this.game.addObstacle(wall04);

    // Walls in the middle.
    const middleWall01: IObstacle = {
      startX: 300,
      startY: 200,
      endX: 300,
      endY: 800
    };
    this.gameState.obstables.push(middleWall01);
    this.game.addObstacle(middleWall01);
    const middleWall02: IObstacle = {
      startX: 700,
      startY: 200,
      endX: 700,
      endY: 800
    };
    this.gameState.obstables.push(middleWall02);
    this.game.addObstacle(middleWall02);

    // Grab HUD element from DOM.
    this.hudElement = document.getElementById("hud");

    // Start the game.
    this.tick();
  }

  private tick() {
    this.robots.map((robot: IRobot, i: number) => {
      // Reset shoot state.
      this.gameState.robots[i].gunShoot = false;

      // Reduce cooldowns.
      if (this.gameState.robots[i].gunCooldown > 0) {
        this.gameState.robots[i].gunCooldown--;
      }

      // Execute robot logic.
      const output: IRobotOutput = robot.tick(this.gameState);

      // Handle steering.
      if (output.left) {
        this.gameState.robots[i].angle += (3 * Math.PI) / 180;
      }
      if (output.right) {
        this.gameState.robots[i].angle -= (3 * Math.PI) / 180;
      }

      // Calculate potential new position.
      if (output.accelerate || output.reverse) {
        let newX: number = 0;
        let newY: number = 0;

        if (output.accelerate) {
          newX =
            this.gameState.robots[i].x +
            Math.sin(this.gameState.robots[i].angle + Math.PI / 2) * 5;
          newY =
            this.gameState.robots[i].y +
            Math.cos(this.gameState.robots[i].angle + Math.PI / 2) * 5;
        }
        if (output.reverse) {
          newX =
            this.gameState.robots[i].x -
            Math.sin(this.gameState.robots[i].angle + Math.PI / 2) * 5;
          newY =
            this.gameState.robots[i].y -
            Math.cos(this.gameState.robots[i].angle + Math.PI / 2) * 5;
        }

        // Detect collision to obstacles.
        const collidingObstacles: Array<IObstacle> = this.gameState.obstables.filter(
          (obstacle: IObstacle) => {
            const collision = detectCircleLineCollision(
              newX,
              newY,
              this.gameState.robots[i].radius,
              obstacle.startX,
              obstacle.startY,
              obstacle.endX,
              obstacle.endY
            );
            return collision.collision;
          }
        );

        // Detect collision with other players.
        // There's always one collision because robot
        // collides with itself.
        const collidingRobots: Array<IRobotState> = this.gameState.robots.filter(
          (robot: IRobotState) => {
            const collision = detectCircleCircleCollision(
              newX,
              newY,
              this.gameState.robots[i].radius,
              robot.x,
              robot.y,
              robot.radius
            );
            return collision.collision;
          }
        );

        // If no collisions, move bot to a new location.
        if (collidingObstacles.length === 0 && collidingRobots.length === 1) {
          this.gameState.robots[i].x = newX;
          this.gameState.robots[i].y = newY;
        }
      }

      // Handle shooting.
      if (output.gunShoot && this.gameState.robots[i].gunCooldown == 0) {
        // Enable shooting and start cooldown.
        this.gameState.robots[i].gunShoot = true;
        this.gameState.robots[i].gunCooldown = 60;

        // Calculate bullet trail.
        const bulletTrail: IBulletTrail = {
          robotId: this.gameState.robots[i].robotId,
          startX: this.gameState.robots[i].x,
          startY: this.gameState.robots[i].y,
          endX:
            this.gameState.robots[i].x +
            Math.sin(this.gameState.robots[i].angle + Math.PI / 2) * 1000,
          endY:
            this.gameState.robots[i].y +
            Math.cos(this.gameState.robots[i].angle + Math.PI / 2) * 1000
        };

        // Check closest bullet trail collision to an obstacle.
        // Shooting through walls is not allowed.
        const bulletTrailCollision: ICollisionResult = detectLineObstaclesCollision(
          bulletTrail.startX,
          bulletTrail.startY,
          bulletTrail.endX,
          bulletTrail.endY,
          this.gameState.obstables
        );

        // Shorten trail.
        if (
          bulletTrailCollision.collision &&
          bulletTrailCollision.point &&
          bulletTrailCollision.point.x &&
          bulletTrailCollision.point.y
        ) {
          bulletTrail.endX = bulletTrailCollision.point.x;
          bulletTrail.endY = bulletTrailCollision.point.y;
        }

        this.gameState.bulletTrails.push(bulletTrail);
      }
    });

    this.gameState.robots.map((robot: IRobotState) => {
      // Deal damages.
      this.gameState.bulletTrails.map((bulletTrail: IBulletTrail) => {
        if (robot.robotId != bulletTrail.robotId) {
          const collision = detectCircleLineCollision(
            robot.x,
            robot.y,
            robot.radius,
            bulletTrail.startX,
            bulletTrail.startY,
            bulletTrail.endX,
            bulletTrail.endY
          );
          if (collision.collision) {
            robot.health -= 20;
          }
        }
      });

      // Apply powerups.
      this.gameState.powerUps.map((powerUp: IPowerUp) => {
        const collision = detectCircleCircleCollision(
          robot.x,
          robot.y,
          robot.radius,
          powerUp.x,
          powerUp.y,
          1
        );
        if (collision.collision) {
          powerUp.lifetime = 0;
          robot.health = 100;
        }
      });
    });

    // Clean expired powerups.
    this.gameState.powerUps = this.gameState.powerUps.filter(
      (powerUp: IPowerUp) => {
        if (powerUp.lifetime > 0) {
          return true;
        } else {
          this.powerUpCooldown = 1000;
          this.game.removePowerUp(powerUp);
          return false;
        }
      }
    );

    // Randomize new powerups.
    if (this.gameState.powerUps.length == 0 && this.powerUpCooldown < 0) {
      const powerUpPositions: Array<Vector2> = [
        new Vector2(100, 100),
        new Vector2(900, 100),
        new Vector2(900, 900),
        new Vector2(100, 900),
        new Vector2(500, 500)
      ];
      const powerUpPosition: Vector2 =
        powerUpPositions[Math.floor(Math.random() * powerUpPositions.length)];

      const healthPowerUp: IPowerUp = {
        x: powerUpPosition.x,
        y: powerUpPosition.y,
        lifetime: 1000,
        id: 1,
        type: PowerUpType.FullHealth
      };
      this.gameState.powerUps.push(healthPowerUp);
      this.game.addPowerUp(healthPowerUp);
    }
    this.powerUpCooldown--;

    // Check game over.
    const aliveRobots: Array<IRobotState> = this.gameState.robots.filter(
      (robot: IRobotState) => robot.health > 0
    );
    const gameOver: boolean = aliveRobots.length == 1;

    // Render scene.
    this.game.render(this.gameState);

    // Render HUD.
    this.hudElement
      ? ReactDOM.render(
          <HUD gameState={this.gameState} gameOver={gameOver} />,
          this.hudElement
        )
      : false;

    // Reset gun vectors.
    this.gameState.bulletTrails = [];

    if (!gameOver) {
      requestAnimationFrame(() => this.tick());
    }
  }
}
