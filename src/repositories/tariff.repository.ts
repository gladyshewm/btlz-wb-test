import knex from "#postgres/knex.js";
import { Tariff } from "#types/tariff.type.js";

export class TariffRepository {
    private readonly table = "tariffs";

    async upsertMany(items: Tariff[]): Promise<void> {
        await knex(this.table)
            .insert(items)
            .onConflict(["snapshot_date", "warehouse_name"])
            .merge({
                box_delivery_and_storage_expr: knex.raw("EXCLUDED.box_delivery_and_storage_expr"),
                box_delivery_base: knex.raw("EXCLUDED.box_delivery_base"),
                box_delivery_liter: knex.raw("EXCLUDED.box_delivery_liter"),
                box_storage_base: knex.raw("EXCLUDED.box_storage_base"),
                box_storage_liter: knex.raw("EXCLUDED.box_storage_liter"),
                updated_at: knex.fn.now(),
            });
    }

    async findByDateSorted(date: string): Promise<Tariff[]> {
        return knex(this.table)
            .select(
                knex.raw("to_char(snapshot_date, 'YYYY-MM-DD') AS snapshot_date"),
                "warehouse_name",
                "box_delivery_and_storage_expr",
                "box_delivery_base",
                "box_delivery_liter",
                "box_storage_base",
                "box_storage_liter",
            )
            .where({ snapshot_date: date })
            .orderBy("box_delivery_and_storage_expr", "asc");
    }
}
