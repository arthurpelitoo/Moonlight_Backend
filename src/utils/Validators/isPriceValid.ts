export function isPriceValid(price: unknown): boolean {
    if (typeof price === 'string' && price.trim() === '') return false;

    const num = Number(price);

    return (
        Number.isFinite(num) &&
        num >= 0 &&
        Number.isInteger(num * 100) // máximo 2 casas decimais
    );
}