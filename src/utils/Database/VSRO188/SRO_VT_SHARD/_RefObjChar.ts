import { BaseModel } from "../../BaseModel/index";

export class _RefObjChar extends BaseModel{
  static TableName = "_RefObjChar"
  ID!: number;

  Lvl!: number;
  CharGender!: number;

  MaxHP!: number;
  MaxMP!: number;

  ResistFrozen!: number;
  ResistFrostbite!: number;
  ResistBurn!: number;
  ResistEShock!: number;
  ResistPoison!: number;
  ResistZombie!: number;
  ResistSleep!: number;
  ResistRoot!: number;
  ResistSlow!: number;
  ResistFear!: number;
  ResistMyopia!: number;
  ResistBlood!: number;
  ResistStone!: number;
  ResistDark!: number;
  ResistStun!: number;
  ResistDisea!: number;
  ResistChaos!: number;
  ResistCsePD!: number;
  ResistCseMD!: number;
  ResistCseSTR!: number;
  ResistCseINT!: number;
  ResistCseHP!: number;
  ResistCseMP!: number;

  Resist24!: number;
  ResistBomb!: number;
  Resist26!: number;
  Resist27!: number;
  Resist28!: number;
  Resist29!: number;
  Resist30!: number;
  Resist31!: number;
  Resist32!: number;

  InventorySize!: number;

  CanStore_TID1!: number;
  CanStore_TID2!: number;
  CanStore_TID3!: number;
  CanStore_TID4!: number;

  CanBeVehicle!: number;
  CanControl!: number;
  DamagePortion!: number;

  MaxPassenger!: number;

  AssocTactics!: number;

  PD!: number;
  MD!: number;
  PAR!: number;
  MAR!: number;
  ER!: number;
  BR!: number;
  HR!: number;
  CHR!: number;

  ExpToGive!: number;
  CreepType!: number;

  Knockdown!: number;
  KO_RecoverTime!: number;

  DefaultSkill_1?: number;
  DefaultSkill_2?: number;
  DefaultSkill_3?: number;
  DefaultSkill_4?: number;
  DefaultSkill_5?: number;
  DefaultSkill_6?: number;
  DefaultSkill_7?: number;
  DefaultSkill_8?: number;
  DefaultSkill_9?: number;
  DefaultSkill_10?: number;

  TextureType?: number;

  Except_1?: number;
  Except_2?: number;
  Except_3?: number;
  Except_4?: number;
  Except_5?: number;
  Except_6?: number;
  Except_7?: number;
  Except_8?: number;
  Except_9?: number;
  Except_10?: number;

  Link?: number;
}
