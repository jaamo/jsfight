import React from "react";
import { IGameState, IRobot, IRobotState } from "../interfaces/interfaces";
import styled from "styled-components";

const HUDElement = styled.div`
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
`;

const GameOver = styled.div`
  position: absolute;
  padding: 1rem;
  font-family: "Chakra Petch", sans-serif;
  font-size: 4rem;
  color: #1c4b82;
  background: white;
  box-shadow: 0 0 2rem rgba(255, 255, 255, 0.7);
  left: 50%;
  top: 50%;
  transform: translatex(-50%) translatey(-50%);
  text-align: center;
`;

const Box = styled.div`
  font-family: "Chakra Petch", sans-serif;
  font-size: 1rem;
  color: white;
  padding: 1rem;
  text-shadow: 0 0 2rem rgba(255, 255, 255, 0.7);
`;
const BoxTitle = styled.div`
  font-size: 2rem;
  font-weight: 700;
  font-family: "Chakra Petch", sans-serif;
`;
const Property = styled.div`
  display: flex;
`;
const PropertyLabel = styled.div`
  opacity: 0.5;
  margin-right: 0.1rem;
`;
const PropertyValue = styled.div``;
export interface IHUDProps {
  gameState: IGameState;
  gameOver: boolean;
}

export default function HUD(props: IHUDProps) {
  return (
    <HUDElement>
      {props.gameOver && <GameOver>GAME OVER!</GameOver>}

      {props.gameState.robots.map((robot: IRobotState) => {
        return (
          <Box key={robot.robotId}>
            <BoxTitle>{robot.name}</BoxTitle>
            <Property>
              <PropertyLabel>x:</PropertyLabel>
              <PropertyValue>{Math.round(robot.x)}</PropertyValue>
            </Property>
            <Property>
              <PropertyLabel>y:</PropertyLabel>
              <PropertyValue>{Math.round(robot.y)}</PropertyValue>
            </Property>
            <Property>
              <PropertyLabel>angle:</PropertyLabel>
              <PropertyValue>
                {Math.round((robot.angle * 180) % 360)}°
              </PropertyValue>
            </Property>
            <Property>
              <PropertyLabel>health:</PropertyLabel>
              <PropertyValue>{robot.health}</PropertyValue>
            </Property>
            <Property>
              <PropertyLabel>cooldown:</PropertyLabel>
              <PropertyValue>{robot.gunCooldown}</PropertyValue>
            </Property>
          </Box>
        );
      })}
    </HUDElement>
  );
}
