import { FTemir } from "@/FTemir";

export class DatabaseNames {
    static SRO_VT_ACCOUNT = "";
    static SRO_VT_LOG = "";
    static SRO_VT_SHARD = "";
    static FTEMIR = "";
    static MASTER = "MASTER";
    
    static SetNames() {
        const settings = FTemir.GetSettings();
        DatabaseNames.SRO_VT_ACCOUNT = settings.AccountDb;
        DatabaseNames.SRO_VT_LOG = settings.LogDb;
        DatabaseNames.SRO_VT_SHARD = settings.SharDb;
        DatabaseNames.FTEMIR = settings.ProxyDb;
        DatabaseNames.MASTER = "MASTER";
    }
    
}