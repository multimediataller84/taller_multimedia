import { TCloseRegister } from "../models/interfaces/ICashRegisterService";

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

  return (
    <div
      className="fixed inset-0 flex justify-center items-center flex-col bg-black/50"
      onClick={() => props.setVisibleClose(false)}
    >
      <div
        className="bg-white w-[30%] h-auto rounded-2xl shadow flex flex-col p-8 space-y-8"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-lato font-medium">Cerrar Caja</h1>
          <div className="space-x-4">
          <button
              className="w-[94px] py-2 rounded-3xl font-Lato font-bold bg-blue-500 hover:bg-blue-800 text-white"
              onClick={async () => {
                // usa siempre el valor de amount
                const closingAmount = props.cashRegisterSelect?.amount ?? 0;

                await props.handleCloseCashRegister(
                  props.cashRegisterSelect?.id,
                  { closing_amount: closingAmount }
                );

                props.setCashRegisterSelect(null);
                props.setVisibleClose(false);
                props.setVisibleInfoCashRegister(false);
              }}
            >
              Cerrar
            </button>
            <button
              className="w-[94px] py-2 rounded-3xl font-Lato font-bold bg-black text-white border-black hover:border-gray-700 hover:bg-gray-700"
              onClick={() => props.setVisibleClose(false)}
            >
              Cancelar
            </button>
          </div>
        </div>

          <label htmlFor="closing_amount" className="text-base text-black font-medium font-lato">
            Monto Cerrar
          </label>
          <input
          className="w-full py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-gray-100 font-normal text-base transition-colors"
          type="number"
          id="closing_amount"
          name="closing_amount"
          value={props.cashRegisterSelect?.amount ?? 0}
          readOnly
          placeholder="Monto Cerrar"
        />

      </div>
    </div>
  );
}
