import { FTemir } from "@/FTemir/index.js";
import { _RefObjChar } from "./_RefObjChar.ts";
import { _RefObjCommon } from "./_RefObjCommon";
import { Database } from "../../index.ts";
import { BaseModel } from "../../BaseModel/index";

export class _Char extends BaseModel {
  static TableName = "_Char"
  private _refObjChar?: _RefObjChar;
  private _refObjCommon?: _RefObjCommon;

  CharID!: number;
  Deleted!: number;

  RefObjID!: number;

  CharName16!: string;
  NickName16!: string;

  Scale!: number;
  CurLevel!: number;
  MaxLevel!: number;

  ExpOffset!: number;
  SExpOffset!: number;

  Strength!: number;
  Intellect!: number;

  RemainGold!: number;
  RemainSkillPoint!: number;
  RemainStatPoint!: number;
  RemainHwanCount!: number;

  GatheredExpPoint!: number;

  HP!: number;
  MP!: number;

  LatestRegion!: number;

  PosX!: number;
  PosY!: number;
  PosZ!: number;

  AppointedTeleport!: number;

  AutoInvestExp!: number;
  InventorySize!: number;

  DailyPK!: number;
  TotalPK!: number;
  PKPenaltyPoint!: number;

  TPP!: number;
  PenaltyForfeit!: number;
  JobPenaltyTime!: number;

  JobLvl_Trader!: number;
  Trader_Exp!: number;

  JobLvl_Hunter!: number;
  Hunter_Exp!: number;

  JobLvl_Robber!: number;
  Robber_Exp!: number;

  GuildID?: number;

  LastLogout!: Date;

  TelRegion!: number;
  TelPosX!: number;
  TelPosY!: number;
  TelPosZ!: number;

  DiedRegion!: number;
  DiedPosX!: number;
  DiedPosY!: number;
  DiedPosZ!: number;

  WorldID!: number;
  TelWorldID!: number;
  DiedWorldID!: number;

  HwanLevel!: number;

  async getRefObjCommon(): Promise<_RefObjCommon> {
    if (this._refObjCommon) return this._refObjCommon;
    if (FTemir.Cache.Cached)
      this._refObjCommon = FTemir.Cache.get<Array<_RefObjCommon>>("_RefObjCommon")?.find(obj => obj.ID == this.RefObjID);
    else {
      const Shard = Database.SRO_VT_SHARD();
      this._refObjCommon = Object.assign(new _RefObjCommon(), await Shard("_RefObjCommon").where("ID", this.RefObjID).first());
    }
    return this._refObjCommon;
  }

  async getRefObjChar(): Promise<_RefObjChar | undefined> {
    await this.getRefObjCommon();

    const link = this._refObjCommon?.Link;
    if (link == null) return undefined;


    if (FTemir.Cache.Cached)
      this._refObjChar = FTemir.Cache.get<Array<_RefObjChar>>("_RefObjChar")?.find(obj => obj.ID == link);
    else {
      const Shard = Database.SRO_VT_SHARD();
      this._refObjChar = Object.assign(new _RefObjCommon(), await Shard("_RefObjChar").where("ID", link).first());
    }
    return this._refObjChar;
  }

  // ===== Helpers =====

  async IsMale(): Promise<boolean> {
    return (await this.getRefObjChar())?.CharGender === 1;
  }

  async IsFemale(): Promise<boolean> {
    return (await this.getRefObjChar())?.CharGender === 0;
  }
}
