export const mapPaymentMethodToES = (method?: string) => {
  if (!method) return "-";
  const key = method.toLowerCase();
  const dict: Record<string, string> = {
    "cash": "Efectivo",
    "credit": "Crédito",
    "credit card": "Tarjeta de crédito",
    "debit": "Débito",
    "debit card": "Tarjeta de débito",
    "transfer": "Transferencia",
    "bank transfer": "Transferencia bancaria",
  };
  return dict[key] ?? method;
};

export const mapStatusToES = (status?: string) => {
  if (!status) return "-";
  const key = status.toLowerCase();
  const dict: Record<string, string> = {
    "paid": "Pagada",
    "unpaid": "No pagada",
    "pending": "Pendiente",
    "overdue": "Vencida",
    "cancelled": "Cancelada",
    "canceled": "Cancelada",
    "draft": "Borrador",
    "partially paid": "Parcialmente pagada",
    "refunded": "Reembolsada",
    "issued": "Emitida",
  };
  return dict[key] ?? status;
};
