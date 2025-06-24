import knex from "#postgres/knex.js";

export class SpreadsheetRepository {
    private readonly table = "spreadsheets";

    async getAllIds(): Promise<string[]> {
        const rows = await knex(this.table).select("spreadsheet_id");
        return rows.map((row) => row.spreadsheet_id);
    }
}
