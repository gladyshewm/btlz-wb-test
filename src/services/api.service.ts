import env from "#config/env/env.js";
import { RawWarehouseTariff } from "#types/raw-warehouse-tariff.type.js";

type ApiResponse = {
    response: {
        data: {
            dtNextBox: string;
            dtTillMax: string;
            warehouseList: RawWarehouseTariff[];
        };
    };
};

export class ApiService {
    private readonly baseUrl = "https://common-api.wildberries.ru/api/v1/tariffs/box";
    private readonly apiKey = env.API_KEY;

    // Сырые данные по тарифам за дату YYYY-MM-DD
    async getTariffs(date: string): Promise<RawWarehouseTariff[]> {
        const url = `${this.baseUrl}?date=${date}`;
        const response = await fetch(url, {
            headers: { "Authorization": this.apiKey },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch tariffs: ${response.statusText}`);
        }

        const data: ApiResponse = await response.json();
        return data.response.data.warehouseList;
    }
}
