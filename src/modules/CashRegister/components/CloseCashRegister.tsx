import { TCloseRegister } from "../models/interfaces/ICashRegisterService";
import { useState } from "react";
import ConfirmDialog from "../../Credit/components/ConfirmDialog";

interface CloseCashRegisterProps {
  visibleClose: boolean;
  setVisibleClose: React.Dispatch<React.SetStateAction<boolean>>;
  cashRegisterSelect: any;
  setCashRegisterSelect: React.Dispatch<React.SetStateAction<any>>;
  handleCloseCashRegister: (id: number, data: TCloseRegister) => Promise<void>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setVisibleInfoCashRegister: React.Dispatch<React.SetStateAction<boolean>>;  
}

export default function CloseCashRegister(props: CloseCashRegisterProps) {

    const [confirmDialog, setConfirmDialog] = useState({
      open: false,
      payload: null as any,
    });

    const confirmClose = async () => {
    if (!confirmDialog.payload) return;

    const closingAmount = confirmDialog.payload.amount ?? 0;

    await props.handleCloseCashRegister(confirmDialog.payload.id, {
      closing_amount: closingAmount,
    });

    props.setCashRegisterSelect(null);
    props.setVisibleClose(false);
    props.setVisibleInfoCashRegister(false);

    // cerrar el diálogo
    setConfirmDialog({ open: false, payload: null });
  };

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center size-full">
       <div className="absolute inset-0 bg-black/50" onClick={() => (props.setVisibleClose(false))} />

        <div className="relative z-100 bg-gray3 rounded-2xl shadow-lg w-[60%] sm:w-[70%] md:w-[50%] lg:w-1/3 2xl:w-1/4 p-6 max-h-[90vh] overflow-y-auto space-y-2 md:space-y-4"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h1 className="text-base sm:text-xl font-semibold">Cerrar Caja</h1>
          <div className="space-x-4">
              <button
              className="py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato font-bold bg-blue-500 hover:bg-blue-800 text-white"
              onClick={() => {
                // Abrir confirmación
                setConfirmDialog({
                  open: true,
                  payload: props.cashRegisterSelect,
                });
              }}
            >
              Cerrar
            </button>
            <button className="py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato font-bold bg-black border-black text-white hover:bg-gray-700 hover:border-gray-700 transition duration-300"
            onClick={() => props.setVisibleClose(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
        <label htmlFor="closing_amount" className="text-sm sm:text-base text-black font-medium">
          Monto Cerrar
        </label>
        <input
          className="w-full py-2 border rounded-3xl px-4 text-gray1 bg-white text-sm sm:text-base border-gray2"
          type="number"
          id="closing_amount"
          name="closing_amount"
          value={props.cashRegisterSelect?.amount ?? 0}
          readOnly
          placeholder="Monto Cerrar"
        />
        </div>
      </div>

      <ConfirmDialog
        open={confirmDialog.open}
        onCancel={() => setConfirmDialog({ open: false, payload: null })}
        onConfirm={confirmClose}
        title="¿Cerrar caja?"
        message="¿Seguro que deseas cerrar esta caja?"
        confirmLabel="Cerrar"
        cancelLabel="Cancelar"
      />
    </div>
  );
}
