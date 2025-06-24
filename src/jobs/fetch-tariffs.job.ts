import { format } from "date-fns";
import { parseNumeric } from "#utils/parse-numeric.js";
import { hasMessage } from "#utils/error.js";
import { ApiService } from "#services/api.service.js";
import { TariffRepository } from "#repositories/tariff.repository.js";
import { Tariff } from "#types/tariff.type.js";
import { Job } from "./job.interface.js";

export class FetchTariffsJob implements Job {
    private readonly name = "FetchTariffsJob";

    constructor(
        private readonly api: ApiService,
        private readonly repo: TariffRepository,
    ) {}

    async run(): Promise<void> {
        try {
            const today = new Date();
            const date = format(today, "yyyy-MM-dd");

            const raw = await this.api.getTariffs(date);
            const items: Tariff[] = raw.map((r) => ({
                snapshot_date: date,
                warehouse_name: r.warehouseName,
                box_delivery_and_storage_expr: parseNumeric(r.boxDeliveryAndStorageExpr),
                box_delivery_base: parseNumeric(r.boxDeliveryBase),
                box_delivery_liter: parseNumeric(r.boxDeliveryLiter),
                box_storage_base: r.boxStorageBase === "-" ? null : parseNumeric(r.boxStorageBase),
                box_storage_liter:
                    r.boxStorageLiter === "-" ? null : parseNumeric(r.boxStorageLiter),
            }));

            await this.repo.upsertMany(items);
            console.log(`[${this.name}] Upserted ${items.length} records for ${date}`);
        } catch (error) {
            if (hasMessage(error)) {
                console.error(`[${this.name}] ${error.message}`);
            }
        }
    }
}
