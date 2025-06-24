import { google } from "googleapis";
import { migrate, seed } from "#postgres/knex.js";
import { Scheduler } from "#cron/scheduler.js";
import { FetchTariffsJob } from "#jobs/fetch-tariffs.job.js";
import { SyncSheetsJob } from "#jobs/sync-sheets.job.js";
import { TariffRepository } from "#repositories/tariff.repository.js";
import { SpreadsheetRepository } from "#repositories/spreadsheet.repository.js";
import { ApiService } from "#services/api.service.js";
import { GoogleAuthService } from "#services/google-auth.service.js";
import { SheetsSyncService } from "#services/sheets-sync.service.js";

await migrate.latest();
await seed.run();

const apiService = new ApiService();
const tariffRepo = new TariffRepository();
const spreadsheetRepo = new SpreadsheetRepository();
const googleAuthService = new GoogleAuthService();
const authClient = googleAuthService.createGoogleAuth();
const sheetsClient = google.sheets({ version: "v4", auth: authClient });
const sheetsSyncService = new SheetsSyncService(spreadsheetRepo, sheetsClient);

const fetchJob = new FetchTariffsJob(apiService, tariffRepo);
const syncJob = new SyncSheetsJob(tariffRepo, sheetsSyncService);

Scheduler.schedule(fetchJob, syncJob);

console.log("All migrations/seeds done, scheduler running");
