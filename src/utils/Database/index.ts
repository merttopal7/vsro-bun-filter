import knex from "knex";
import type { Knex } from "knex";
import { config, configWithMigration } from "@/utils/Database/config";
import { DatabaseNames } from "./DatabaseNames";
import { FTemir } from "@/FTemir";
import { DatabaseAdapters } from "@/core/types";

export class Database {
    static Initalized: boolean = false;
    static Adapters: DatabaseAdapters = {}

    static async Initalize() {
        if (Database.Initalized) return;
        DatabaseNames.SetNames();
        await Database.EnsureDatabase(DatabaseNames.FTEMIR);
        await Database.GenerateAdapters();
        Database.Initalized = true;
    }

    static async EnsureDatabase(dbName: string) {
        Database.MasterDatabase();
        const result = await Database.Adapters[DatabaseNames.MASTER].raw(`
            SELECT name FROM sys.databases WHERE name = ?
        `, [dbName]);

        const exists = result.length > 0;

        if (!exists) {
            console.log(`[DB] Creating database: ${dbName}`);
            await Database.Adapters[DatabaseNames.MASTER].raw(`CREATE DATABASE [${dbName}]`);
        }
    }


    static GenerateBaseConfig(DATABASE_NAME: string) {
        const settings = FTemir.GetSettings();
        const baseConnection: Knex.MsSqlConnectionConfig = {
            user: settings.Username,
            password: settings.Password,
            server: settings.Address,
            port: settings.Port,
            database: DATABASE_NAME,
            options: {
                encrypt: false,
                trustServerCertificate: true
            }
        };
        if (DATABASE_NAME === "MASTER") delete baseConnection.database;
        return baseConnection;
    }

    static GeneratePoolConfig() {
        const settings = FTemir.GetSettings();
        const poolSettings = {
            min: settings.MinimumPool,
            max: settings.MaximumPool
        }
        return poolSettings;
    }

    static MasterDatabase() {
        const cfg = config;
        cfg.development.connection = Database.GenerateBaseConfig(DatabaseNames.MASTER);
        cfg.development.pool = Database.GeneratePoolConfig();
        Database.Adapters[DatabaseNames.MASTER] = knex(cfg.development);
    }

    static async GenerateAdapters() {
        const values = Object.values(DatabaseNames);
        for (let i = 0; i < values.length; i++) {
            const value: string = values[i];
            const IsFTEMIR = value == DatabaseNames.FTEMIR;
            const cfg = IsFTEMIR ? configWithMigration : config;
            cfg.development.connection = Database.GenerateBaseConfig(DatabaseNames[value]);
            cfg.development.pool = Database.GeneratePoolConfig();
            Database.Adapters[value] = knex(cfg.development);
            if (IsFTEMIR)
                await Database.Adapters[value].migrate.latest();
        }
    }
    static SRO_VT_ACCOUNT(): Knex {
        return Database.Adapters[DatabaseNames.SRO_VT_ACCOUNT];
    }
    static SRO_VT_LOG(): Knex {
        return Database.Adapters[DatabaseNames.SRO_VT_LOG];
    }
    static SRO_VT_SHARD(): Knex {
        return Database.Adapters[DatabaseNames.SRO_VT_SHARD];
    }
    static FTEMIR(): Knex {
        return Database.Adapters[DatabaseNames.FTEMIR];
    }
    static CUSTOM(DATABASE_NAME: string): Knex {
        return Database.Adapters[DATABASE_NAME];
    }
}