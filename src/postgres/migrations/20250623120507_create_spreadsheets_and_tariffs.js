/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    await knex.schema.createTable("spreadsheets", (table) => {
        table.increments("id").primary();
        table.string("spreadsheet_id").notNullable().unique();
        table.timestamps(true, true);
    });

    await knex.schema.createTable("tariffs", (table) => {
        table.increments("id").primary();
        table.date("snapshot_date").notNullable();
        table.string("warehouse_name").notNullable();
        table.decimal("box_delivery_and_storage_expr", 10, 2).notNullable();
        table.decimal("box_delivery_base", 10, 2).notNullable();
        table.decimal("box_delivery_liter", 10, 2).notNullable();
        table.decimal("box_storage_base", 10, 2).nullable();
        table.decimal("box_storage_liter", 10, 2).nullable();
        table.timestamps(true, true);
        table.unique(["snapshot_date", "warehouse_name"]);
    });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists("tariffs");
    await knex.schema.dropTableIfExists("spreadsheets");
}
