import { sheets_v4 } from "googleapis";
import { hasMessage } from "#utils/error.js";
import { Tariff } from "#types/tariff.type.js";
import { SpreadsheetRepository } from "#repositories/spreadsheet.repository.js";

export class SheetsSyncService {
    private readonly name = "SheetsSyncService";

    constructor(
        private readonly repo: SpreadsheetRepository,
        private readonly sheetsClient: sheets_v4.Sheets,
    ) {}

    async syncForDate(tariffs: Tariff[]): Promise<void> {
        try {
            const SHEET_NAME = "stocks_coefs";
            const header = [
                [
                    "snapshot_date",
                    "warehouse_name",
                    "expr",
                    "base_delivery",
                    "liter_delivery",
                    "base_storage",
                    "liter_storage",
                ],
            ];
            const rows = tariffs.map((t) => [
                t.snapshot_date,
                t.warehouse_name,
                t.box_delivery_and_storage_expr,
                t.box_delivery_base,
                t.box_delivery_liter,
                t.box_storage_base ?? "",
                t.box_storage_liter ?? "",
            ]);

            const allIds = await this.repo.getAllIds();

            for (const id of allIds) {
                const range = `${SHEET_NAME}!A1:G${rows.length + 1}`;
                await this.sheetsClient.spreadsheets.values.update({
                    spreadsheetId: id,
                    range,
                    valueInputOption: "RAW",
                    requestBody: {
                        values: [...header, ...rows],
                    },
                });
                console.log(`[${this.name}] Synced ${rows.length} rows to sheet ${id}`);
            }
        } catch (error) {
            if (hasMessage(error)) {
                throw new Error(`Error syncing sheets: ${error.message}`);
            }
            throw new Error(`Error syncing sheets: ${error}`);
        }
    }
}
