import { StaticType } from "@/core/types";
export type Farm = {
  Id: StaticType<number>;
  Name: StaticType<string>;
};

export type Shard = {
  Id: StaticType<number>;
  Name: StaticType<string>;
  OnlineCount: StaticType<number>;
  Capacity: StaticType<number>;
  Status: StaticType<number>;
  FarmId: StaticType<number>;
};

export const LoginErrorCode = {
  InvalidCredentials: 1,
  Blocked: 2,
  AlreadyConnected: 4,
  ServerIsFull: 6,
  VSRO_IPLimit: 0x8,
  ISRO_IPLimit: 0xB,
  UIIO_CLIENT_START_CONTENT_FAIL_BILLING_FAILED: 0xC,
  UIIO_CLIENT_START_CONTENT_FAIL_BILLING_RELATED: 0xD,
  UIIO_SMERR_ADULT_ONLY_SERVER: 0xE,
  UIIO_SMERR_TEENOVER_ONLY_SERVER: 0xF,
  UITT_TEENSERVER_ERRMGS_ADULT: 0x10
} as const;

export type LoginErrorCode =
  typeof LoginErrorCode[keyof typeof LoginErrorCode];

export const LoginBlockType = {
  Punishment: 1,
  AccountInspection: 2,
  NoAccountInfo: 3,
  FreeServiceOver: 4
} as const;

export type LoginBlockType =
  typeof LoginBlockType[keyof typeof LoginBlockType];


export const PacketResultType = {
  Disconnect: 1,
  Block: 2,
  Nothing: 3
} as const;

export type PacketResultType =
  typeof PacketResultType[keyof typeof PacketResultType];
