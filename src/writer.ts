import { Socket } from 'net';
import { v4 } from 'uuid';

import { outgoing } from 'esproto';

import * as Constants from './constants';
import { Command, Credentials } from './types';
import wtfuuid from './wtfuuid';


export const writer = (connection: Socket, credentials?: Credentials) => (command: Command) => {

  let buffer: Buffer;
  let dataOffset;

  const encoder = outgoing[ command.code ];
  const data = (encoder.encode as any)(command.data).finish() as Buffer;
  const dataLength = data.byteLength;
  const code = Number(command.code);
  const correlationId = command.correlationId || v4();
  const creds = command.credentials || credentials || false;

  if (creds) {
    const { username, password } = creds;
    const usernameLength = Buffer.byteLength(username);
    const passwordLength = Buffer.byteLength(password);
    const byteLength = (
      Constants.CORRELATION_ID_END_OFFSET +
      1 + usernameLength +
      1 + passwordLength +
      dataLength
    );
    buffer = Buffer.alloc(byteLength);
    buffer.writeUInt8(Constants.FLAG_WITH_AUTH, Constants.FLAGS_OFFSET);
    buffer.writeUInt8(usernameLength, Constants.CREDENTIALS_OFFSET);
    buffer.write(username, Constants.CREDENTIALS_OFFSET + 1);
    buffer.writeUInt8(passwordLength, Constants.CREDENTIALS_OFFSET + 1 + usernameLength);
    buffer.write(password, Constants.CREDENTIALS_OFFSET + 1 + usernameLength + 1);
    dataOffset = Constants.CREDENTIALS_OFFSET + 1 + usernameLength + 1 + passwordLength;
  } else {
    const byteLength = Constants.CORRELATION_ID_END_OFFSET + dataLength;
    buffer = Buffer.alloc(byteLength);
    buffer.writeUInt8(Constants.FLAG_WITHOUT_AUTH, Constants.FLAGS_OFFSET);
    dataOffset = Constants.DATA_OFFSET;
  }
  buffer.writeUInt32LE(buffer.byteLength - Constants.UINT32_LENGTH, 0);
  buffer.writeUInt8(code, Constants.COMMAND_OFFSET);
  wtfuuid.write(correlationId, buffer, Constants.CORRELATION_ID_OFFSET);
  if (data) {
    data.copy(buffer, dataOffset, 0);
  }
  connection.write(buffer);
  return correlationId;
};
