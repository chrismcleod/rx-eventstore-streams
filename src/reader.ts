import { Socket } from 'net';
import Rx from 'rxjs/Rx';

import { incoming, labels } from 'esproto';

import * as Constants from './constants';
import { Event, StreamAccumulation } from './types';
import wtfuuid from './wtfuuid';

const bytes = (connection: Socket) => {
  return Rx.Observable
    .fromEvent<Buffer>(connection as any, 'data')
    .map(buffer => Rx.Observable.from(buffer))
    .concatAll()
    .share();
};

const scan = (acc: StreamAccumulation, byte: number) => {
  if (acc.read === acc.total) {
    acc.read = 0;
    acc.total = 0;
    acc.buffer = [];
  }

  acc.buffer.push(byte);
  acc.read += 1;

  if (acc.read < 4) return acc;
  if (acc.read === 4) acc.total = (new DataView((new Uint8Array(acc.buffer)).buffer)).getUint32(0, true) + 4;
  return acc;
};

const read = (buffer: number[]): Event => {
  const command = Buffer.from(buffer);
  const code = command.readUInt8(Constants.COMMAND_OFFSET);
  const correlationId = wtfuuid.read(buffer.slice(Constants.CORRELATION_ID_OFFSET, Constants.CORRELATION_ID_END_OFFSET));
  const type = labels[ code ];
  let data: any = {};
  if (buffer.length > Constants.CORRELATION_ID_END_OFFSET) {
    const decoder = incoming[ code ];
    if (decoder) data = decoder.decode(Buffer.from(buffer.slice(Constants.DATA_OFFSET)));
  }
  return { code, correlationId, data, type };
};

export const reader = (connection: Socket) => {

  return bytes(connection)
    .scan(scan, { buffer: [] as number[], read: 0, total: 0 })
    .filter(acc => acc.read === acc.total)
    .map(({ buffer }) => read(buffer))
    .share();
};
