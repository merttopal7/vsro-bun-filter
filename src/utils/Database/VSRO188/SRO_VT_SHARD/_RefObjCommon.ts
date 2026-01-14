import { BaseModel } from "../../BaseModel";

export class _RefObjCommon extends BaseModel {
  static TableName = "_RefObjCommon"
  Service!: number;
  ID!: number;

  CodeName128!: string;
  ObjName128!: string;
  OrgObjCodeName128!: string;

  NameStrID128!: string;
  DescStrID128!: string;

  CashItem!: number;
  Bionic!: number;

  TypeID1!: number;
  TypeID2!: number;
  TypeID3!: number;
  TypeID4!: number;

  DecayTime!: number;

  Country!: number;
  Rarity!: number;

  CanTrade!: number;
  CanSell!: number;
  CanBuy!: number;
  CanBorrow!: number;
  CanDrop!: number;
  CanPick!: number;
  CanRepair!: number;
  CanRevive!: number;
  CanUse!: number;
  CanThrow!: number;

  Price!: number;
  CostRepair!: number;
  CostRevive!: number;
  CostBorrow!: number;
  KeepingFee!: number;
  SellPrice!: number;

  ReqLevelType1!: number;
  ReqLevel1!: number;

  ReqLevelType2!: number;
  ReqLevel2!: number;

  ReqLevelType3!: number;
  ReqLevel3!: number;

  ReqLevelType4!: number;
  ReqLevel4!: number;

  MaxContain!: number;

  RegionID!: number;
  Dir!: number;

  OffsetX!: number;
  OffsetY!: number;
  OffsetZ!: number;

  Speed1!: number;
  Speed2!: number;

  Scale!: number;

  BCHeight!: number;
  BCRadius!: number;

  EventID!: number;

  AssocFileObj128!: string;
  AssocFileDrop128!: string;
  AssocFileIcon128!: string;
  AssocFile1_128!: string;
  AssocFile2_128!: string;

  Link!: number;
}
