import nodeCron from "node-cron";
import { Job } from "#jobs/job.interface.js";
import { CRON_EXPRESSION } from "./constants.js";

export class Scheduler {
    static schedule(fetchJob: Job, syncJob: Job): void {
        // Каждый час обновляем данные в БД
        nodeCron.schedule(CRON_EXPRESSION.EVERY_HOUR, () => fetchJob.run());
        // Каждую ночь в 00:00 (или также поменять на EVERY_HOUR) синхронизируем данные с Google Sheets
        nodeCron.schedule(CRON_EXPRESSION.EVERY_MIDNIGHT, () => syncJob.run());
    }
}
