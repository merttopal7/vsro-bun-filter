import { Database } from "@/utils/Database/index";
import { BaseModel } from "@/utils/Database/BaseModel/index";


export class FTemirModel extends BaseModel {
    static query(this: HasTableName) {
        const db = Database.FTEMIR();
        return db(this.TableName);
    }
}