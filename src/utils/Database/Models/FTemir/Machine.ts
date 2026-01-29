import { FTemir } from "@/FTemir/index.js";
import { FTemirModel } from "./FTemirModel.js";

export class Machine extends FTemirModel {
  static TableName = "Machine";
  
  MachineId!: number;
  Address!: string;
  Notice?: string;
}
