export const fmtCRC = (n: number) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
  }).format(Number(n || 0));

export const fmtMargin = (m: number) =>
  m <= 1 ? `${(m * 100).toFixed(0)}%` : `${m}%`;
