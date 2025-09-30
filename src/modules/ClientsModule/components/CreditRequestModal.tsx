import { useState } from "react";
import type { TCredit } from "../models/types/TCredit";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: Omit<TCredit, "customer_id">) => Promise<void> | void;
};

export default function CreditRequestModal({ open, onClose, onSubmit }: Props) {
  const [amount, setAmount] = useState<string>("");
  const [due, setDue] = useState<string>("");

  if (!open) return null;
  return (
    <div className="fixed inset-0 grid place-items-center bg-black/40 z-50">
      <div className="bg-white p-5 rounded-lg w-[420px]">
        <h3 className="text-lg font-semibold mb-3">Solicitar crédito</h3>
        <div className="space-y-3">
          <input type="number" min={0} step="0.01" value={amount}
                 onChange={e => setAmount(e.target.value)}
                 placeholder="Monto" className="w-full border p-2 rounded" />
          <input type="date" value={due} onChange={e => setDue(e.target.value)}
                 className="w-full border p-2 rounded" />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-3 py-1 border rounded" onClick={onClose}>Cancelar</button>
          <button className="px-3 py-1 rounded bg-blue-600 text-white"
            onClick={async () => { 
              await onSubmit({ credit_amount: Number(amount || 0), due_date: due || null });
              onClose();
            }}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
