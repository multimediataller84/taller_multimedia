import { useState } from "react";
import type { TCreditEndpoint } from "../models/types/TCredit";

type Props = {
  open: boolean;
  credit: TCreditEndpoint | null;
  onClose: () => void;
  onSubmit: (amount: number) => Promise<void> | void;
};

export default function CreditPaymentModal({ open, credit, onClose, onSubmit }: Props) {
  const [amount, setAmount] = useState<string>("");
  if (!open || !credit) return null;

  return (
    <div className="fixed inset-0 grid place-items-center bg-black/40 z-50">
      <div className="bg-white p-5 rounded-lg w-[420px]">
        <h3 className="text-lg font-semibold mb-3">Abonar crédito</h3>
        <p className="text-sm mb-2">
          Saldo actual: <b>₡{Number(credit.balance).toLocaleString()}</b>
        </p>
        <input type="number" min={0} step="0.01" value={amount}
               onChange={e => setAmount(e.target.value)}
               placeholder="Monto a abonar" className="w-full border p-2 rounded" />
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-3 py-1 border rounded" onClick={onClose}>Cancelar</button>
          <button className="px-3 py-1 rounded bg-blue-600 text-white"
            onClick={async () => { await onSubmit(Number(amount || 0)); onClose(); }}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
