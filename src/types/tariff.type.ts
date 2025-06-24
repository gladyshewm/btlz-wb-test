export type Tariff = {
    snapshot_date: string; // YYYY-MM-DD
    warehouse_name: string;
    box_delivery_and_storage_expr: number;
    box_delivery_base: number;
    box_delivery_liter: number;
    box_storage_base: number | null;
    box_storage_liter: number | null;
};
