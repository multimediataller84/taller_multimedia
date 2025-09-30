import type { TCreditEndpoint } from "../models/types/TCredit";

type Props = {
  rows: TCreditEndpoint[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onClose: (id: number) => void;
  onPay: (row: TCreditEndpoint) => void;
};

export default function CreditTable({ rows, onApprove, onReject, onClose, onPay }: Props) {
  return (
    <table className="min-w-full text-sm bg-white rounded-xl overflow-hidden">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-3 py-2 text-left">Fecha</th>
          <th className="px-3 py-2 text-left">Monto</th>
          <th className="px-3 py-2 text-left">Saldo</th>
          <th className="px-3 py-2 text-left">Estado</th>
          <th className="px-3 py-2 text-right">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.id} className="border-t">
            <td className="px-3 py-2">{new Date(r.created_at).toLocaleDateString()}</td>
            <td className="px-3 py-2">₡{Number(r.credit_amount).toLocaleString()}</td>
            <td className="px-3 py-2">₡{Number(r.balance).toLocaleString()}</td>
            <td className="px-3 py-2">{r.status}</td>
            <td className="px-3 py-2">
              <div className="flex justify-end gap-2">
                {r.status === "requested" || r.status === "pending_review" ? (
                  <>
                    <button className="px-2 py-1 border rounded" onClick={() => onApprove(r.id)}>Aprobar</button>
                    <button className="px-2 py-1 border rounded" onClick={() => onReject(r.id)}>Rechazar</button>
                  </>
                ) : null}
                {r.status === "approved" && (
                  <>
                    <button className="px-2 py-1 border rounded" onClick={() => onPay(r)}>Abonar</button>
                    <button className="px-2 py-1 border rounded" onClick={() => onClose(r.id)}>Cerrar</button>
                  </>
                )}
              </div>
            </td>
          </tr>
        ))}
        {rows.length === 0 && (
          <tr>
            <td colSpan={5} className="px-3 py-6 text-center text-gray-500">No hay créditos.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
