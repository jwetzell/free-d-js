const { deepEqual, throws } = require('assert');
const { describe, it } = require('node:test');
const { decode } = require('../dist/cjs');

const goodTests = [
  {
    description: 'simple position message',
    bytes: new Uint8Array([
      0xd1, 0x01, 0x5a, 0x00, 0x00, 0x2d, 0x00, 0x00, 0xa6, 0x00, 0x00, 0x7f, 0xff, 0x40, 0x7f, 0xff, 0x80, 0x7f, 0xff,
      0xc0, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x00, 0x00, 50,
    ]),
    expected: {
      type: 0xd1,
      id: 1,
      pan: 180,
      tilt: 90,
      roll: -180,
      posX: 131069,
      posY: 131070,
      posZ: 131071,
      zoom: 66051,
      focus: 263430,
      spare: 0,
    },
  },
];

const badTests = [
  {
    description: 'position - bad checksum',
    bytes: new Uint8Array([
      0xd1, 0x01, 0x5a, 0x00, 0x00, 0x2d, 0x00, 0x00, 0xa6, 0x00, 0x00, 0x7f, 0xff, 0x40, 0x7f, 0xff, 0x80, 0x7f, 0xff,
      0xc0, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x00, 0x00, 100,
    ]),
    throwsMessage: { name: /^Error$/, message: /failed checksum/ },
  },
  {
    description: 'position - incomplete',
    bytes: new Uint8Array([
      0xd1, 0x01, 0x5a, 0x00, 0x00, 0x2d, 0x00, 0x00, 0xa6, 0x00, 0x00, 0x7f, 0xff, 0x40, 0x7f, 0xff, 0x80, 0x7f, 0xff,
      0xc0, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x00, 0x00,
    ]),
    throwsMessage: { name: /^Error$/, message: /should be 29 bytes/ },
  },
  {
    description: 'empty bytes',
    bytes: new Uint8Array([]),
    throwsMessage: { name: /^Error$/, message: /cannot decode 0 bytes/ },
  },
  {
    description: 'bad message type',
    bytes: new Uint8Array([0xff]),
    throwsMessage: { name: /^Error$/, message: /unsupported freeD/ },
  },
];

describe('FreeD Bytes Decoding', () => {
  goodTests.forEach((bytesTest) => {
    it(bytesTest.description, () => {
      const decoded = decode(bytesTest.bytes);
      deepEqual(decoded, bytesTest.expected);
    });
  });
});

describe('FreeD Bytes Decoding Throws', () => {
  badTests.forEach((bytesTest) => {
    it(bytesTest.description, () => {
      throws(() => {
        decode(bytesTest.bytes);
      }, bytesTest.throwsMessage);
    });
  });
});
