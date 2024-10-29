import { FreeDPosition, FreeDMessageType } from './types';
import { checksum, positionToFreeDUnits, rotationToFreeDUnits } from './utils';

function positionMessageToBytes(message: FreeDPosition): Uint8Array {
  const bytes = new Uint8Array(29);

  bytes[0] = FreeDMessageType.Position;
  bytes[1] = message.id;

  bytes.set(rotationToFreeDUnits(message.pan), 2);
  bytes.set(rotationToFreeDUnits(message.tilt), 5);
  bytes.set(rotationToFreeDUnits(message.roll), 8);

  bytes.set(positionToFreeDUnits(message.posX), 11);
  bytes.set(positionToFreeDUnits(message.posY), 14);
  bytes.set(positionToFreeDUnits(message.posZ), 17);

  bytes[20] = Math.trunc(message.zoom / 65536);
  bytes[21] = Math.trunc((message.zoom / 256) % 256);
  bytes[22] = message.zoom % 256;

  bytes[23] = Math.trunc(message.focus / 65536);
  bytes[24] = Math.trunc((message.focus / 256) % 256);
  bytes[25] = message.focus % 256;

  if (message.spare !== undefined) {
    bytes[26] = message.spare >> 8;
    bytes[27] = message.spare % 256;
  }

  bytes[28] = checksum(bytes.subarray(0, 28));
  return bytes;
}
export function encode(message: FreeDPosition): Uint8Array {
  switch (message.type) {
    case FreeDMessageType.Position:
      return positionMessageToBytes(message);
    default:
      throw new Error('unsupported freeD message type');
  }
}
