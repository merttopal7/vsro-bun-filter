import { Cache } from "@/utils/Cache";
import { Database } from "@/utils/Database";
import { _RefObjChar } from "@/utils/Database/Models/VSRO188/SRO_VT_SHARD/_RefObjChar";
import { _RefObjCommon } from "@/utils/Database/Models/VSRO188/SRO_VT_SHARD/_RefObjCommon";

export class FTemirCache extends Cache {
    Cached: boolean = false;

    constructor() {
        super();
    }

    CacheTables: string[] = ["_RefObjCommon", "_RefObjChar", "_RefObjItem", "_RefSkill", "_RefRegion", "_RefLevel"];

    async FetchSingleTableForCache<T>(TABLE_NAME: string, cl: T) {
        if (!this.CacheTables.includes(TABLE_NAME)) return;
        const Shard = Database.SRO_VT_SHARD();
        const items = await Shard.raw(`SELECT * FROM ${TABLE_NAME}`)
        this.set(TABLE_NAME, items.map((item: T) => Object.assign(new cl(), item)));
        console.log(`[Cache] ${TABLE_NAME}(${items.length}) cached!`)
    }

    async FetchTablesForCache() {
        this.Cached = false;
        const promises: Array<Promise<void>> = [];
        console.log("[Cache] started to fetch for Cache!")

        promises.push(this.FetchSingleTableForCache<_RefObjCommon>("_RefObjCommon", _RefObjCommon))
        promises.push(this.FetchSingleTableForCache<_RefObjChar>("_RefObjChar", _RefObjChar))
        
        await Promise.all(promises)
        this.Cached = true;
    }

}