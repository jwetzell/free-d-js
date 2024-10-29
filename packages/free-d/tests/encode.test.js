const { deepEqual, throws } = require('assert');
const { describe, it } = require('node:test');
const { encode } = require('../dist/cjs');

const goodTests = [
  {
    description: 'simple position message',
    message: {
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
    expected: new Uint8Array([
      0xd1, 0x01, 0x5a, 0x00, 0x00, 0x2d, 0x00, 0x00, 0xa6, 0x00, 0x00, 0x7f, 0xff, 0x40, 0x7f, 0xff, 0x80, 0x7f, 0xff,
      0xc0, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x00, 0x00, 50,
    ]),
  },
];

const badTests = [
  {
    description: 'unsupported message',
    message: {
      type: 0xff,
    },
    throwsMessage: { name: /^Error$/, message: /unsupported freeD message type/ },
  },
];

describe('FreeD Message Encoding', () => {
  goodTests.forEach((messageTest) => {
    it(messageTest.description, () => {
      const decoded = encode(messageTest.message);
      deepEqual(decoded, messageTest.expected);
    });
  });
});

describe('FreeD Message Encoding Throws', () => {
  badTests.forEach((messageTest) => {
    it(messageTest.description, () => {
      throws(() => {
        encode(messageTest.message);
      }, messageTest.throwsMessage);
    });
  });
});
