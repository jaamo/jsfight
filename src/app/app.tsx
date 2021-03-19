import React, { DOMElement } from "react";
import ReactDOM from "react-dom";
import { GameScene } from "./objects/GameScene";
import { Vector2 } from "three";
import {
  IGameState,
  IRobot,
  IRobotOutput,
  IBulletTrail,
  IRobotState,
  IObstacle,
  ICollisionResult,
  PowerUpType,
  IPowerUp,
  IJSFightMap,
} from "./interfaces/interfaces";
import { MapGenerator } from "./classes/MapGenerator";
import Robot01 from "./robots/Robot01";
import Robot02 from "./robots/Robot02";
import { detectCircleLineCollision } from "./helpers/detectCircleLineCollision";
import { detectLineObstaclesCollision } from "./helpers/detectLineObstaclesCollision";
import { detectCircleCircleCollision } from "./helpers/detectCircleCircleCollision";
import { simplifyAngle } from "./helpers/simplifyAngle";
import HUD from "./hud/Hud";

export class App {
  // 3D scene.
  private game: GameScene;

  // Game state object.
  private gameState: IGameState;

  // Robot objects. These are the actual robots written by players.
  private robots: Array<IRobot> = [];

  // Root DOM element for HUD.
  private hudElement: HTMLElement | null = null;

  // Number of ticks until power-ups are added again.
  private powerUpCooldown: number = 1000;

  /**
   * Initialize scene and game.
   */
  constructor() {
    // Init game state.
    this.gameState = {
      robots: [],
      bulletTrails: [],
      obstables: [],
      powerUps: [],
    };

    // Init 3D scene.
    this.game = new GameScene();

    // Create robots.
    this.initRobots();

    // Init map.
    this.initMap();

    // Grab HUD element from DOM.
    this.hudElement = document.getElementById("hud");

    // Start the game.
    this.tick();
  }

  /**
   * Game tick. Executes everything and call itself again.
   * Loop is interrupted when there's only one robot left.
   */
  private tick() {
    // First execute robot movements and handle shootings.
    this.robots.map((robot: IRobot, i: number) => {
      // Reset shoot state.
      this.gameState.robots[i].gunShoot = false;

      // Reduce gun cooldowns.
      if (this.gameState.robots[i].gunCooldown > 0) {
        this.gameState.robots[i].gunCooldown--;
      }

      // Execute robot logic. THIS IS THE SHIIIIIIT!
      const output: IRobotOutput = robot.tick(this.gameState);

      // Handle steering.
      this.handleRotation(i, output);

      // Calculate new position.
      this.handleMovement(i, output);

      // Handle shooting.
      this.handleShooting(i, output);
    });

    // Deal damages to players getting hit.
    this.dealDamage();

    // Handle powerups.
    this.handlePowerUps();

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

  /**
   * Create robots. Currently everything works only
   * if there are two robots :)
   */
  initRobots(): void {
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
      health: 100,
      robotId: 1,
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
      health: 100,
      robotId: 2,
    });
  }

  /**
   * Initialize map. Add obstacles.
   */
  initMap(): void {
    const mapGenerator: MapGenerator = new MapGenerator();
    const map: IJSFightMap = mapGenerator.getRandomMap();
    map.obstacles.map((obstacle: IObstacle) => {
      this.gameState.obstables.push(obstacle);
      this.game.addObstacle(obstacle);
    });
  }

  /**
   * Calculate robot rotation.
   */
  handleRotation(robotIndex: number, output: IRobotOutput): void {
    if (output.left) {
      this.gameState.robots[robotIndex].angle = simplifyAngle(
        this.gameState.robots[robotIndex].angle + (3 * Math.PI) / 180
      );
    }
    if (output.right) {
      this.gameState.robots[robotIndex].angle = simplifyAngle(
        this.gameState.robots[robotIndex].angle - (3 * Math.PI) / 180
      );
    }
  }

  /**
   * Calculate robot movement. Check collisions with obstacles and other players.
   */
  handleMovement(robotIndex: number, output: IRobotOutput): void {
    if (output.accelerate || output.reverse) {
      // First calculate potential new position.
      let newX: number = 0;
      let newY: number = 0;
      if (output.accelerate) {
        newX =
          this.gameState.robots[robotIndex].x +
          Math.sin(this.gameState.robots[robotIndex].angle + Math.PI / 2) * 5;
        newY =
          this.gameState.robots[robotIndex].y +
          Math.cos(this.gameState.robots[robotIndex].angle + Math.PI / 2) * 5;
      }
      if (output.reverse) {
        newX =
          this.gameState.robots[robotIndex].x -
          Math.sin(this.gameState.robots[robotIndex].angle + Math.PI / 2) * 5;
        newY =
          this.gameState.robots[robotIndex].y -
          Math.cos(this.gameState.robots[robotIndex].angle + Math.PI / 2) * 5;
      }

      // Detect collision to obstacles.
      const collidingObstacles: Array<IObstacle> = this.gameState.obstables.filter(
        (obstacle: IObstacle) => {
          const collision = detectCircleLineCollision(
            newX,
            newY,
            this.gameState.robots[robotIndex].radius,
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
            robot.radius,
            robot.x,
            robot.y,
            robot.radius
          );
          return collision.collision;
        }
      );

      // If no collisions, move bot to a new location.
      if (collidingObstacles.length === 0 && collidingRobots.length === 1) {
        this.gameState.robots[robotIndex].x = newX;
        this.gameState.robots[robotIndex].y = newY;
      }
    }
  }

  handleShooting(robotIndex: number, output: IRobotOutput): void {
    if (output.gunShoot && this.gameState.robots[robotIndex].gunCooldown == 0) {
      // Enable shooting and start cooldown.
      this.gameState.robots[robotIndex].gunShoot = true;
      this.gameState.robots[robotIndex].gunCooldown = 60;

      // Calculate bullet trail.
      const bulletTrail: IBulletTrail = {
        robotId: this.gameState.robots[robotIndex].robotId,
        startX: this.gameState.robots[robotIndex].x,
        startY: this.gameState.robots[robotIndex].y,
        endX:
          this.gameState.robots[robotIndex].x +
          Math.sin(this.gameState.robots[robotIndex].angle + Math.PI / 2) *
            1000,
        endY:
          this.gameState.robots[robotIndex].y +
          Math.cos(this.gameState.robots[robotIndex].angle + Math.PI / 2) *
            1000,
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
  }

  /**
   * Loop through robots and bullet trails. If bullet trail
   * overlaps with a robot reduce health.
   */
  dealDamage(): void {
    this.gameState.robots.map((robot: IRobotState) => {
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
    });
  }

  /**
   * Apply powerups to robots. Clean expired powerups. Randomise new powerups.
   */
  handlePowerUps(): void {
    // Apply powerups.
    this.gameState.robots.map((robot: IRobotState) => {
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
        new Vector2(500, 500),
      ];
      const powerUpPosition: Vector2 =
        powerUpPositions[Math.floor(Math.random() * powerUpPositions.length)];

      const healthPowerUp: IPowerUp = {
        x: powerUpPosition.x,
        y: powerUpPosition.y,
        lifetime: 1000,
        id: 1,
        type: PowerUpType.FullHealth,
      };
      this.gameState.powerUps.push(healthPowerUp);
      this.game.addPowerUp(healthPowerUp);
    }

    // Reduce cooldown.
    this.powerUpCooldown--;
  }
}
