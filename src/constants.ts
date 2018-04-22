export const FLAG_WITH_AUTH = 1;
export const FLAG_WITHOUT_AUTH = 0;
export const UINT32_LENGTH = 4;
export const GUID_LENGTH = 16;
export const COMMAND_OFFSET = UINT32_LENGTH;
export const FLAGS_OFFSET = COMMAND_OFFSET + 1;
export const CORRELATION_ID_OFFSET = FLAGS_OFFSET + 1;
export const CORRELATION_ID_END_OFFSET = CORRELATION_ID_OFFSET + GUID_LENGTH;
export const DATA_OFFSET = CORRELATION_ID_END_OFFSET;
export const CREDENTIALS_OFFSET = DATA_OFFSET;
