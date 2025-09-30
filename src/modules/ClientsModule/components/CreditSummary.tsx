type Props = {
  summary: import("../models/types/TCredit").CreditSummary | null;
};
export default function CreditSummary({ summary }: Props) {
  if (!summary) return null;
  return (
    <div className="mb-3 flex gap-6 text-sm">
      <div><b>Crédito habilitado:</b> {summary.enabled ? "Sí" : "No"}</div>
      <div><b>Tipo:</b> {summary.unlimited ? "Sin límite" : "Con límite"}</div>
      {!summary.unlimited && <div><b>Límite:</b> ₡{summary.limit?.toLocaleString()}</div>}
      <div><b>Usado:</b> ₡{summary.used.toLocaleString()}</div>
      <div><b>Disponible:</b> {summary.available === "infinite" ? "∞" : `₡${Number(summary.available).toLocaleString()}`}</div>
    </div>
  );
}
