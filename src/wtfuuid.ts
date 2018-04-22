const byteOrder = [ 3, 2, 1, 0, 5, 4, 7, 6, 8, 9, 10, 11, 12, 13, 14, 15 ];

const write = (source: string, to?: Buffer, offset: number = 0) => {
  const wtfUUID = convert(source).replace(/-/g, '');
  const uuidBuffer = Buffer.from(wtfUUID, 'hex');
  if (to) {
    uuidBuffer.copy(to, offset, 0);
  }
  return uuidBuffer;
};

const read = (source: Buffer | Uint8Array | number[]) => {
  const destination = Buffer.alloc(16);
  for (let i = 0; i < 16; i += 1) {
    destination[ i ] = source[ byteOrder[ i ] ];
  }
  const destStr = destination.toString('hex');
  let out = `${destStr.substr(0, 8)}-`;
  out += `${destStr.substr(8, 4)}-`;
  out += `${destStr.substr(12, 4)}-`;
  out += `${destStr.substr(16, 4)}-`;
  out += `${destStr.substr(20)}`;
  return out;
};

const convert = function (uuid: string) {
  const hex = uuid.replace(/-/g, '');
  return (
    hex.substring(6, 8) +
    hex.substring(4, 6) +
    hex.substring(2, 4) +
    hex.substring(0, 2) + '-' +
    hex.substring(10, 12) +
    hex.substring(8, 10) + '-' +
    hex.substring(14, 16) +
    hex.substring(12, 14) + '-' +
    hex.substring(16, 20) + '-' +
    hex.substring(20)
  );
};

export default { write, read, convert };
