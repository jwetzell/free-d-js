export function checksum(bytes: Uint8Array): number {
  let checksum = 0x40;

  bytes.forEach((byte) => {
    checksum -= byte;
    if (checksum < 0) {
      checksum += 256;
    }
  });
  return checksum;
}

export function rotationToFreeDUnits(rotation: number): Uint8Array {
  const view = new DataView(new ArrayBuffer(4));
  const units = rotation * 32768 * 256;
  view.setInt32(0, units);
  return new Uint8Array(view.buffer, 0, 3);
}

export function positionToFreeDUnits(position: number): Uint8Array {
  const view = new DataView(new ArrayBuffer(4));
  const units = position * 64 * 256;
  view.setInt32(0, units);
  return new Uint8Array(view.buffer, 0, 3);
}

export function freeDUnitsToRotation(upper: number, middle: number, lower: number): number {
  const padded = new Uint8Array([upper, middle, lower, 0]);
  const view = new DataView(padded.buffer, padded.byteOffset, padded.byteLength);
  return view.getInt32(0) / 256 / 32768;
}

export function freeDUnitsToPosition(upper: number, middle: number, lower: number): number {
  const padded = new Uint8Array([upper, middle, lower, 0]);
  const view = new DataView(padded.buffer, padded.byteOffset, padded.byteLength);
  return view.getInt32(0) / 256 / 64;
}
