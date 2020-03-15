import { detectLineLineCollision } from "./detectLineLineCollission";

test("Line-to-line: no collision", () => {
  expect(detectLineLineCollision(0, 0, 5, 0, 0, 10, 5, 10).collision).toBe(
    false
  );
  expect(
    detectLineLineCollision(10, 10, 10, 0, 20, 100, 400, 300).collision
  ).toBe(false);
});

test("Line-to-line: collision", () => {
  expect(detectLineLineCollision(0, 0, 6, 0, 3, 6, 3, -6).collision).toBe(true);
});
