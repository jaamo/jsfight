import {
  Color,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  PointLight,
  Clock,
  Vector2,
  LineBasicMaterial,
  Geometry,
  Line
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader.js";
import { OrbitControls } from "three-orbitcontrols-ts";
import { Robot } from "./Robot";
import { Axis } from "./Axis";
import { Arena } from "./Arena";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import {
  IGameState,
  IRobotState,
  IBulletTrail,
  IObstacle,
  IPowerUp
} from "../interfaces/gameState";
import { BulletTrailObject } from "./BulletTrail";
import { Obstacle } from "./Obstacle";
import { PowerUp } from "./PowerUp";

//https://colorhunt.co/palette/141534

export class GameScene {
  private readonly scene: Scene = new Scene();
  private readonly camera: PerspectiveCamera = new PerspectiveCamera(
    45,
    innerWidth / innerHeight,
    0.1,
    10000
  );
  private readonly renderer: WebGLRenderer = new WebGLRenderer({
    antialias: true,
    canvas: document.getElementById("main-canvas") as HTMLCanvasElement
  });
  private readonly composer: EffectComposer;
  private readonly clock: Clock = new Clock();
  private readonly tank01: Robot;
  private readonly tank02: Robot;
  private readonly tanks: Array<Robot> = [];
  private powerUps: Array<PowerUp> = [];
  private bulletTrailObjects: Array<BulletTrailObject> = [];

  constructor() {
    // Setup camera.
    this.camera.position.set(1500, 1500, 1500);
    this.camera.lookAt(new Vector3(500, 0, 500));

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableZoom = true;
    controls.target.set(500, 0, 500);

    controls.update();

    // Game area
    const arena: Arena = new Arena();
    this.scene.add(arena);

    // Add exis.
    const axis: Axis = new Axis();
    // this.scene.add(axis);

    // Add tank 1
    this.tank01 = new Robot();
    this.tank01.translateX(100);
    this.tank01.translateZ(500);
    this.scene.add(this.tank01);

    // Add tank 2
    this.tank02 = new Robot();
    this.tank02.translateX(900);
    this.tank02.translateZ(500);
    this.tank02.rotateY(Math.PI);
    this.scene.add(this.tank02);

    this.tanks.push(this.tank01);
    this.tanks.push(this.tank02);

    const spotLight = new PointLight(0xffffff, 1);
    spotLight.translateX(500);
    spotLight.translateY(500);
    spotLight.translateZ(500);
    this.scene.add(spotLight);

    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setClearColor(new Color("#183661"));

    this.composer = new EffectComposer(this.renderer);
    this.composer.setSize(innerWidth, innerHeight);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    const unrealBloomPass: UnrealBloomPass = new UnrealBloomPass(
      new Vector2(innerWidth, innerHeight),
      0.5,
      0,
      0
    );

    var effectCopy = new ShaderPass(CopyShader);
    effectCopy.renderToScreen = true;
    this.composer.addPass(unrealBloomPass);

    const filmPass = new FilmPass(
      0.1, // noise intensity
      0.025, // scanline intensity
      10, // scanline count
      0 // grayscale
    );
    filmPass.renderToScreen = true;
    this.composer.addPass(filmPass);

    // this.render();
  }

  public addObstacle(obstacle: IObstacle): void {
    const o: Obstacle = new Obstacle(obstacle);
    this.scene.add(o);
  }

  public addPowerUp(powerUp: IPowerUp) {
    const p: PowerUp = new PowerUp(powerUp);
    this.scene.add(p);
    this.powerUps.push(p);
  }

  public removePowerUp(powerUp: IPowerUp) {
    this.powerUps = this.powerUps.filter((p: PowerUp) => {
      if (p.powerUpId != powerUp.id) {
        return true;
      } else {
        this.scene.remove(p);
        return false;
      }
    });
  }

  private adjustCanvasSize() {
    this.composer.setSize(innerWidth, innerHeight);
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
  }

  public render(gameState: IGameState) {
    const delta = this.clock.getDelta();

    const tanks = this.tanks;

    gameState.robots.map((robotState: IRobotState, i: number) => {
      tanks[i].position.set(robotState.x, 0, robotState.y);
      tanks[i].rotation.set(0, robotState.angle, 0);
    });

    // Add new bullet trails.
    gameState.bulletTrails.map((bulletTrail: IBulletTrail) => {
      const bulletTrailObject: BulletTrailObject = new BulletTrailObject(
        bulletTrail
      );
      this.scene.add(bulletTrailObject);
      this.bulletTrailObjects.push(bulletTrailObject);
    });

    // Animate & clean bullet trails.
    this.bulletTrailObjects.map((bulletTrailObject: BulletTrailObject) => {
      bulletTrailObject.tick();
      if (bulletTrailObject.isDead()) {
        this.scene.remove(bulletTrailObject);
      }
      // TODO remove from array
    });

    this.composer.render(delta);

    this.adjustCanvasSize();
  }
}
