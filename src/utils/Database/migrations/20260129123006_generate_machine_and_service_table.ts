import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  /* =========================
     Machine
     ========================= */
  await knex.schema.createTable("Machine", (table) => {
    table.increments("MachineId").primary();

    table.string("Address", 15).notNullable(); // nvarchar(15)
    table.string("Notice", "max").nullable(); // nvarchar(max)
  });

  /* =========================
     Service
     ========================= */
  await knex.schema.createTable("Service", (table) => {
    table.increments("ServiceId").primary();

    table.string("Name", "max").notNullable(); // nvarchar(max)
    table.integer("ServerType").notNullable();
    table.integer("RemotePort").notNullable();
    table.integer("BindPort").notNullable();

    table.boolean("AutoStart").notNullable();

    table.integer("LocalMachine_MachineId").notNullable();
    table.integer("RemoteMachine_MachineId").notNullable();
    table.integer("SpoofMachine_MachineId").nullable();

    table
      .specificType("SecurityType", "tinyint")
      .notNullable()
      .defaultTo(0);

    /* ---------- Foreign Keys ---------- */
    table
      .foreign("LocalMachine_MachineId")
      .references("MachineId")
      .inTable("Machine");

    table
      .foreign("RemoteMachine_MachineId")
      .references("MachineId")
      .inTable("Machine");

    table
      .foreign("SpoofMachine_MachineId")
      .references("MachineId")
      .inTable("Machine");
  });
}

export async function down(knex: Knex): Promise<void> {
  // FK olduğu için önce Service silinir
  await knex.schema.dropTableIfExists("Service");
  await knex.schema.dropTableIfExists("Machine");
}
