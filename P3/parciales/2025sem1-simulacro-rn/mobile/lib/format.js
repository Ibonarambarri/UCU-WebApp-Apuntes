/** "$ 200" — precio con formato simple. */
export function formatPrice(price) {
  return `$ ${price}`;
}

/** "16/06/2025, 09:30" — fecha ISO a algo legible (hora local). */
export function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleString('es-UY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
