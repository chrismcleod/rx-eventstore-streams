import { createConnection } from 'net';

import { reader } from './reader';
import { Client, Config } from './types';
import { writer } from './writer';

export const connect = async (config: Config) => {
  const connection = createConnection({ host: config.host, port: config.port });
  return new Promise<Client>((res) => {
    connection.on('data', (buffer) => {
      if (buffer.readUInt8(4) === 1) {
        const response = Buffer.from(buffer);
        response[4] = 2;
        connection.write(response);
      }
    });
    connection.once('connect', () => {
      res({
        $: reader(connection),
        send: writer(connection, config.credentials),
      });
    });
  });
};
