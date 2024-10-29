import { FreeDPosition, FreeDMessageType } from './types';
import { checksum, freeDUnitsToPosition, freeDUnitsToRotation } from './utils';

function bytesToPositionMessage(bytes: Uint8Array): FreeDPosition {
  const id = bytes[1];
  const pan = freeDUnitsToRotation(bytes[2], bytes[3], bytes[4]);
  const tilt = freeDUnitsToRotation(bytes[5], bytes[6], bytes[7]);
  const roll = freeDUnitsToRotation(bytes[8], bytes[9], bytes[10]);

  const posX = freeDUnitsToPosition(bytes[11], bytes[12], bytes[13]);
  const posY = freeDUnitsToPosition(bytes[14], bytes[15], bytes[16]);
  const posZ = freeDUnitsToPosition(bytes[17], bytes[18], bytes[19]);

  const zoom = bytes[20] * 65536 + bytes[21] * 256 + bytes[22];
  const focus = bytes[23] * 65536 + bytes[24] * 256 + bytes[25];

  const spare = bytes[26] * 256 + bytes[27];

  return {
    type: FreeDMessageType.Position,
    id,
    pan,
    tilt,
    roll,
    posX,
    posY,
    posZ,
    zoom,
    focus,
    spare,
  };
}

export function decode(bytes: Uint8Array): FreeDPosition | undefined {
  if (bytes.length === 0) {
    throw new Error('cannot decode 0 bytes');
  }

  const messageType = bytes[0];

  switch (messageType) {
    case FreeDMessageType.Position:
      if (bytes.length !== 29) {
        throw new Error('freeD position message should be 29 bytes long');
      }

      if (checksum(bytes.subarray(0, bytes.length - 1)) !== bytes[bytes.length - 1]) {
        throw new Error('freeD message failed checksum');
      }

      return bytesToPositionMessage(bytes);
    default:
      throw new Error('unsupported freeD message type');
  }
}
