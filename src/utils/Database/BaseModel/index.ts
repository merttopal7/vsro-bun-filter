import { Database } from "..";

type HasTableName = {
    TableName: string;
};

type Constructor<T> = new () => T;

export class BaseModel {
    static query(this: HasTableName) {
        const Shard = Database.SRO_VT_SHARD();
        return Shard(this.TableName);
    }

    static async fromQuery<T>(
        this: Constructor<T>,
        knexQuery: Promise<any>
    ): Promise<T> {
        const data = await knexQuery;
        return Object.assign(new this(), data);
    }
}