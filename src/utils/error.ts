export function hasMessage(x: unknown): x is { message: string } {
    return Boolean(typeof x === "object" && x && "message" in x && typeof x.message === "string");
}
