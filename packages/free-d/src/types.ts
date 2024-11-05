export enum FreeDMessageType {
  Position = 0xd1,
}

export type FreeDPosition = {
  type: FreeDMessageType.Position;
  id: number;
  pan: number;
  tilt: number;
  roll: number;
  posZ: number;
  posX: number;
  posY: number;
  zoom: number;
  focus: number;
  spare?: number;
};
