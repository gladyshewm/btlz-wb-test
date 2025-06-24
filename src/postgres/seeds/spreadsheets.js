/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
    await knex("spreadsheets")
        .insert([
            { spreadsheet_id: "17orL_lAAdrovWC6QfE1eV3RbiufDVoFrhwDJUKTAB_w" },
            { spreadsheet_id: "1J9GnWkCq5j3A4T6seoEI9bbMPZLI_6npAvVDvxhBwLg" },
        ])
        .onConflict(["spreadsheet_id"])
        .ignore();
}
