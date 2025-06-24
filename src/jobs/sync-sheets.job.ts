import { format } from "date-fns";
import { hasMessage } from "#utils/error.js";
import { TariffRepository } from "#repositories/tariff.repository.js";
import { SheetsSyncService } from "#services/sheets-sync.service.js";
import { Job } from "./job.interface.js";

export class SyncSheetsJob implements Job {
    private readonly name = "SyncSheetsJob";

    constructor(
        private readonly tariffRepo: TariffRepository,
        private readonly sheetsService: SheetsSyncService,
    ) {}

    async run(): Promise<void> {
        try {
            const today = new Date();
            const date = format(today, "yyyy-MM-dd");
            const tariffs = await this.tariffRepo.findByDateSorted(date);

            await this.sheetsService.syncForDate(tariffs);
            console.log(`[${this.name}] Synced sheets for ${date}`);
        } catch (error) {
            if (hasMessage(error)) {
                console.error(`[${this.name}] ${error.message}`);
            }
        }
    }
}
