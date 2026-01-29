import { Database } from "@/utils/Database/index";

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
    ): Promise<T | T[] | null> {
        const data = await knexQuery;

        if (!data) return null;

        if (Array.isArray(data)) {
            return data.map(row =>
                Object.assign(new this(), row)
            );
        }

        return Object.assign(new this(), data);
    }
}
