export function isPriceValid(price: unknown): boolean {
  if (typeof price === "string" && price.trim() === "") return false;

  const num = Number(price);

  return (
<<<<<<< HEAD
    Number.isFinite(num) && num >= 0 && Number.isInteger(Math.round(num * 100)) // máximo 2 casas decimais
=======
    Number.isFinite(num) && num >= 0 && Number.isInteger(num * 100) // máximo 2 casas decimais
>>>>>>> 1145c08 (fix: importações corretas, seguindo o padrão atual de codigo.)
  );
}
