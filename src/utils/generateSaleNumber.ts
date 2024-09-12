export function generateSaleNumber(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let saleNumber = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    saleNumber += characters.charAt(randomIndex);
  }
  return saleNumber;
}
