import { FTemir } from "@/FTemir/index.js";
import { Database } from "../../index.js";
import { Machine } from "./Machine.js";
import { FTemirModel } from "./FTemirModel.js";

export class Service extends FTemirModel {
  static TableName = "Service";

  LocalIP?: string;
  RemoteIP?: string;
  private _localMachine?: Machine;
  private _remoteMachine?: Machine;
  private _spoofMachine?: Machine | null;

  ServiceId!: number;
  Name!: string;
  ServerType!: number;
  RemotePort!: number;
  BindPort!: number;
  AutoStart!: boolean;
  SecurityType!: number;

  LocalMachine_MachineId!: number;
  RemoteMachine_MachineId!: number;
  SpoofMachine_MachineId?: number;

  static withMachine(machineId?: number) {
    const q = Service.query()
      .leftJoin("Machine as LM", "LM.MachineId", "Service.LocalMachine_MachineId")
      .leftJoin("Machine as RM", "RM.MachineId", "Service.RemoteMachine_MachineId");

    if (machineId != null)
      q.where("Service.LocalMachine_MachineId", machineId)

    return q.select(
      "Service.*",
      "LM.Address as LocalIP",
      "RM.Address as RemoteIP"
    );
  }

  /* =========================
     Relations
     ========================= */

  async getLocalMachine(): Promise<Machine> {
    if (this._localMachine) return this._localMachine;

    if (FTemir.Cache.Cached) {
      this._localMachine =
        FTemir.Cache
          .get<Array<Machine>>("Machine")
          ?.find(m => m.MachineId === this.LocalMachine_MachineId);
    } else {
      const db = Database.FTEMIR();
      this._localMachine = Object.assign(
        new Machine(),
        await db("Machine")
          .where("MachineId", this.LocalMachine_MachineId)
          .first()
      );
    }

    return this._localMachine!;
  }

  async getRemoteMachine(): Promise<Machine> {
    if (this._remoteMachine) return this._remoteMachine;

    if (FTemir.Cache.Cached) {
      this._remoteMachine =
        FTemir.Cache
          .get<Array<Machine>>("Machine")
          ?.find(m => m.MachineId === this.RemoteMachine_MachineId);
    } else {
      const db = Database.FTEMIR();
      this._remoteMachine = Object.assign(
        new Machine(),
        await db("Machine")
          .where("MachineId", this.RemoteMachine_MachineId)
          .first()
      );
    }

    return this._remoteMachine!;
  }

  async getSpoofMachine(): Promise<Machine | null> {
    if (!this.SpoofMachine_MachineId) return null;
    if (this._spoofMachine) return this._spoofMachine;

    if (FTemir.Cache.Cached) {
      this._spoofMachine =
        FTemir.Cache
          .get<Array<Machine>>("Machine")
          ?.find(m => m.MachineId === this.SpoofMachine_MachineId) ?? null;
    } else {
      const db = Database.FTEMIR();
      const row = await db("Machine")
        .where("MachineId", this.SpoofMachine_MachineId)
        .first();

      this._spoofMachine = row
        ? Object.assign(new Machine(), row)
        : null;
    }

    return this._spoofMachine;
  }

  /* =========================
     Helpers
     ========================= */

  async IsAutoStart(): Promise<boolean> {
    return this.AutoStart === true;
  }

  async HasSpoof(): Promise<boolean> {
    return !!this.SpoofMachine_MachineId;
  }
}
