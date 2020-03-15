import { detectCircleLineCollision } from "./detectCircleLineCollision";

// const sum = require("./detectCollision");

test("no-collision", () => {
  expect(detectCircleLineCollision(0, 0, 1, 5, 5, 10, 10).collision).toBe(
    false
  );
  expect(detectCircleLineCollision(0, 0, 1, -10, 2, 10, 2).collision).toBe(
    false
  );
  expect(detectCircleLineCollision(5, 5, 5, 100, 0, 200, 200).collision).toBe(
    false
  );
});

test("tangential-collision", () => {
  let coll = detectCircleLineCollision(0, 0, 1, -10, 1, 10, 1);
  expect(coll.collision).toBe(true);
  if (coll.point) {
    expect(coll.point.x).toBe(0);
    expect(coll.point.y).toBe(1);
    expect(coll.point.dist).toBe(1);
  }
  coll = detectCircleLineCollision(0, 0, 1, -10, -1, 10, -1);
  expect(coll.collision).toBe(true);
  if (coll.point) {
    expect(coll.point.x).toBe(0);
    expect(coll.point.y).toBe(-1);
    expect(coll.point.dist).toBe(1);
  }
});

test("intersection-collision", () => {
  let coll = detectCircleLineCollision(0, 0, 1, -5, 0, 5, 0);
  expect(coll.collision).toBe(true);
  if (coll.point) {
    expect(coll.point.x).toBe(-1);
    expect(coll.point.y).toBe(0);
    expect(coll.point.dist).toBe(4);
  }
  coll = detectCircleLineCollision(0, 0, 1, -50, 0, 5, 0);
  expect(coll.collision).toBe(true);
  if (coll.point) {
    expect(coll.point.x).toBe(-1);
    expect(coll.point.y).toBe(0);
    expect(coll.point.dist).toBe(49);
  }
  coll = detectCircleLineCollision(5, 5, 2, 5, 20, 5, -10);
  expect(coll.collision).toBe(true);
  if (coll.point) {
    expect(coll.point.x).toBe(5);
    expect(coll.point.y).toBe(7);
    expect(coll.point.dist).toBe(13);
  }
});
