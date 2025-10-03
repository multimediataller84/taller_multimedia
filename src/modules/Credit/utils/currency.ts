export const formatCRC = (value: number) =>
  new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(value);