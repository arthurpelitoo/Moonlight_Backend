export function isPriceValid(price: unknown): boolean {
    if (price === undefined || price === null || price === '') return false;
    return !isNaN(Number(price)) && Number(price) >= 0;
}