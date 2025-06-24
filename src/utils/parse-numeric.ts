export function parseNumeric(input: string): number {
    const normalized = input.trim().replace(",", ".");
    const value = parseFloat(normalized);

    if (!isFinite(value)) {
        throw new Error(`Unable to parse numeric value from "${input}"`);
    }

    return value;
}
