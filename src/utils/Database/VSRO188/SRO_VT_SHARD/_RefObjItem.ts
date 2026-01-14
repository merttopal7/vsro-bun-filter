import { FTemir } from "@/FTemir";
import { _RefObjCommon } from "./_RefObjCommon";
import { BaseModel } from "../../BaseModel";

export class RefObjItem extends BaseModel {
  static TableName = "RefObjItem"
  private _refObjCommon?: RefObjCommon;

  public ID: number = 0;
  public MaxStack: number = 0;
  public ReqGender: number = 0;
  public ReqStr: number = 0;
  public ReqInt: number = 0;
  public ItemClass: number = 0;
  public SetID: number = 0;
  public Dur_L: number = 0;
  public Dur_U: number = 0;
  public PD_L: number = 0;
  public PD_U: number = 0;
  public PDInc: number = 0;
  public ER_L: number = 0;
  public ER_U: number = 0;
  public ERInc: number = 0;
  public PAR_L: number = 0;
  public PAR_U: number = 0;
  public PARInc: number = 0;
  public BR_L: number = 0;
  public BR_U: number = 0;
  public MD_L: number = 0;
  public MD_U: number = 0;
  public MDInc: number = 0;
  public MAR_L: number = 0;
  public MAR_U: number = 0;
  public MARInc: number = 0;
  public PDStr_L: number = 0;
  public PDStr_U: number = 0;
  public MDInt_L: number = 0;
  public MDInt_U: number = 0;
  public Quivered: number = 0;
  public Ammo1_TID4: number = 0;
  public Ammo2_TID4: number = 0;
  public Ammo3_TID4: number = 0;
  public Ammo4_TID4: number = 0;
  public Ammo5_TID4: number = 0;
  public SpeedClass: number = 0;
  public TwoHanded: number = 0;
  public Range: number = 0;
  public PAttackMin_L: number = 0;
  public PAttackMin_U: number = 0;
  public PAttackMax_L: number = 0;
  public PAttackMax_U: number = 0;
  public PAttackInc: number = 0;
  public MAttackMin_L: number = 0;
  public MAttackMin_U: number = 0;
  public MAttackMax_L: number = 0;
  public MAttackMax_U: number = 0;
  public MAttackInc: number = 0;
  public PAStrMin_L: number = 0;
  public PAStrMin_U: number = 0;
  public PAStrMax_L: number = 0;
  public PAStrMax_U: number = 0;
  public MAInt_Min_L: number = 0;
  public MAInt_Min_U: number = 0;
  public MAInt_Max_L: number = 0;
  public MAInt_Max_U: number = 0;
  public HR_L: number = 0;
  public HR_U: number = 0;
  public HRInc: number = 0;
  public CHR_L: number = 0;
  public CHR_U: number = 0;
  public Param1: number = 0;
  public Desc1_128: string = '';
  public Param2: number = 0;
  public Desc2_128: string = '';
  public Param3: number = 0;
  public Desc3_128: string = '';
  public Param4: number = 0;
  public Desc4_128: string = '';
  public Param5: number = 0;
  public Desc5_128: string = '';
  public Param6: number = 0;
  public Desc6_128: string = '';
  public Param7: number = 0;
  public Desc7_128: string = '';
  public Param8: number = 0;
  public Desc8_128: string = '';
  public Param9: number = 0;
  public Desc9_128: string = '';
  public Param10: number = 0;
  public Desc10_128: string = '';
  public Param11: number = 0;
  public Desc11_128: string = '';
  public Param12: number = 0;
  public Desc12_128: string = '';
  public Param13: number = 0;
  public Desc13_128: string = '';
  public Param14: number = 0;
  public Desc14_128: string = '';
  public Param15: number = 0;
  public Desc15_128: string = '';
  public Param16: number = 0;
  public Desc16_128: string = '';
  public Param17: number = 0;
  public Desc17_128: string = '';
  public Param18: number = 0;
  public Desc18_128: string = '';
  public Param19: number = 0;
  public Desc19_128: string = '';
  public Param20: number = 0;
  public Desc20_128: string = '';
  public MaxMagicOptCount: number = 0;
  public ChildItemCount: number = 0;
  public Link: number = 0;

  public async getRefObjCommon(): Promise<RefObjCommon> {
    if (!this._refObjCommon) {
      if (FTemir.Cache.Cached)
            this._refObjCommon = FTemir.Cache.get<Array<_RefObjCommon>>("_RefObjCommon").find(c => c.Link === this.ID);
          else {
            const Shard = Database.SRO_VT_SHARD();
            this._refObjCommon = Object.assign(new _RefObjCommon(), await Shard("_RefObjCommon").where("Link", this.ID).first());
          }
    }
    
    return this._refObjCommon;
  }

  public async isGold(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isStackable() && refObj.TypeID3 === 5 && refObj.TypeID4 === 0;
  }

  public async isEquip(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return refObj.TypeID2 === 1;
  }

  public async isAvatar(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isEquip() && (refObj.TypeID3 === 13 || refObj.TypeID3 === 14);
  }

  public async isJobEquip(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return refObj.TypeID2 === 4;
  }

  public async isFellowEquip(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return refObj.TypeID2 === 5;
  }

  public async isJobOutfit(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isEquip() && refObj.TypeID3 === 7 && 
           refObj.TypeID4 !== 4 && refObj.TypeID4 !== 5;
  }

  public async isStackable(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return refObj.TypeID2 === 3;
  }

  public async isTrading(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isStackable() && refObj.TypeID3 === 8;
  }

  public async isNormalTrading(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isTrading() && refObj.TypeID4 === 1;
  }

  public async isSpecialTrading(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isTrading() && refObj.TypeID4 === 2;
  }

  public async isSpecialtyGoodBox(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isTrading() && refObj.TypeID4 === 3;
  }

  public async isQuest(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isStackable() && refObj.TypeID3 === 9;
  }

  public async isAmmunition(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isStackable() && refObj.TypeID3 === 4;
  }

  public async isPet(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return refObj.TypeID2 === 2 && refObj.TypeID3 === 1;
  }

  public async isGrowthPet(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isPet() && refObj.TypeID4 === 1;
  }

  public async isGrabPet(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isPet() && refObj.TypeID4 === 2;
  }

  public async isFellowPet(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isPet() && refObj.TypeID4 === 3;
  }

  public async isTransmonster(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return refObj.TypeID2 === 2 && refObj.TypeID3 === 2;
  }

  public async isMagicCube(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return refObj.TypeID2 === 2 && refObj.TypeID3 === 3;
  }

  public async isSkill(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isStackable() && refObj.TypeID3 === 13 && refObj.TypeID4 === 1;
  }

  public async isPotion(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isStackable() && refObj.TypeID3 === 1;
  }

  public async isHpPotion(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isPotion() && refObj.TypeID4 === 1;
  }

  public async isMpPotion(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isPotion() && refObj.TypeID4 === 2;
  }

  public async isAllPotion(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isPotion() && refObj.TypeID4 === 3;
  }

  public async isUniversalPill(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isStackable() && refObj.TypeID3 === 2 && refObj.TypeID4 === 6;
  }

  public async isPurificationPill(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isStackable() && refObj.TypeID3 === 2 && refObj.TypeID4 === 1;
  }

  public async isAbnormalPotion(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isStackable() && refObj.TypeID3 === 2 && refObj.TypeID4 === 9;
  }

  public async isCosHpPotion(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isPotion() && refObj.TypeID4 === 4 && this.Param2 === 0;
  }

  public async isFellowHpPotion(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isPotion() && refObj.TypeID4 === 4 && this.Param2 !== 0;
  }

  public async isCosRevivalPotion(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isPotion() && refObj.TypeID4 === 6;
  }

  public async isHwanPotion(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isPotion() && refObj.TypeID4 === 8;
  }

  public async isHgpPotion(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isPotion() && refObj.TypeID4 === 9 && this.Param1 === 10;
  }

  public async isPet2SatietyPotion(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isPotion() && refObj.TypeID4 === 9 && this.Param1 > 10;
  }

  public async isRepairKit(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isPotion() && refObj.TypeID4 === 10;
  }

  public async isArmor(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isEquip() && (refObj.TypeID3 === 1 || 
           refObj.TypeID3 === 2 || refObj.TypeID3 === 3 || 
           refObj.TypeID3 === 9 || refObj.TypeID3 === 10 || 
           refObj.TypeID3 === 11);
  }

  public async isShield(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isEquip() && refObj.TypeID3 === 4;
  }

  public async isAccessory(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isEquip() && (refObj.TypeID3 === 5 || refObj.TypeID3 === 12);
  }

  public async isWeapon(): Promise<boolean> {
    const refObj = await this.getRefObjCommon();
    return await this.isEquip() && refObj.TypeID3 === 6;
  }

  public degree(): number {
    return Math.floor((this.ItemClass - 1) / 3) + 1;
  }

  public degreeOffset(): number {
    return this.ItemClass - 3 * Math.floor((this.ItemClass - 1) / 3) - 1;
  }
}
