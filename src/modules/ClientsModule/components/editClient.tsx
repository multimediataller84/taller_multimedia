import { useEffect, useState } from "react";
import { TCustomerEndpoint } from "../models/types/TCustomerEndpoint";
import { useCredit } from "../hooks/useCredit";
import CreditSummary from "../components/CreditSummary";
import CreditTable from "../components/CreditTable";
import CreditRequestModal from "../components/CreditRequestModal";
import CreditPaymentModal from "../components/CreditPaymentModal";

interface editClientProps { 
  clientSelect: TCustomerEndpoint | null;
  setClientSelect: React.Dispatch<React.SetStateAction<any>>;
  edit: boolean;
  handleSave: () => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleDelete: (id: number) => void;
}

export default function editClient(props: editClientProps) {
  const [moveBar, setmMoveBar] = useState(0);

  useEffect(() => {
    if (!props.clientSelect) return;
    props.setClientSelect((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        credit_enabled: prev?.credit_enabled ?? false,
        credit_unlimited: prev?.credit_unlimited ?? false,
        credit_limit: prev?.credit_unlimited
          ? null
          : (typeof prev?.credit_limit === "number" ? prev.credit_limit : 0),
      };
    });
  }, [props.clientSelect?.id]);

  const {
  list,
  summary,
  loading,
  requestCredit,
  approve,
  reject,
  close,
  addPayment,
  refetch,     
} = useCredit(props.clientSelect?.id ?? 0);

  const [openRequest, setOpenRequest] = useState(false);
  const [openPay, setOpenPay] = useState(false);
  const [currentCredit, setCurrentCredit] = useState<any>(null);

  return (
    <div className="w-[65%] flex flex-col ">
      <div className="bg-gray3 w-full flex flex-col">
        <div className="flex w-full justify-between pt-8">
          <h2 className="pl-8 font-Lato text-2xl ">Datos del Cliente</h2>
          <div className="flex space-x-8 pr-4">
            <button
              className={`w-[94px] py-2 rounded-3xl font-Lato font-bold transition duration-300 
                ${props.edit ? "bg-blue-500 text-white hover:bg-blue-800 hover:border-blue-800" 
                : "bg-white border border-gray2 text-gray1 hover:bg-gray2 hover:border-gray2"}`}
              onClick={props.handleSave}
            >
              Editar
            </button>
            <button
              className="w-[94px] py-2 rounded-3xl bg-[#FF4747] border border-[#FF4747] hover:bg-[#D32626] text-white font-Lato font-bold transition duration-300 "
              onClick={() => props.clientSelect && props.handleDelete(props.clientSelect.id)}
            >
              Eliminar
            </button>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <div className="flex w-full mt-8 space-y-4 font-lato font-medium">
            <h2
              className={`w-1/3 text-center ${moveBar === 0 ? "text-blue-500" : "text-gray1"}`}
              onClick={() => setmMoveBar(0)}
            >
              Información General
            </h2>
            <h3
              className={`w-1/3 text-center ${moveBar === 1 ? "text-blue-500" : "text-gray1"}`}
              onClick={() => setmMoveBar(1)}
            >
              Facturas
            </h3>
            <h4
              className={`w-1/3 text-center ${moveBar === 2 ? "text-blue-500" : "text-gray1"}`}
              onClick={() => setmMoveBar(2)}
            >
              Créditos
            </h4>
          </div>
          <div className="w-full h-1 bg-graybar relative">
            <div
              className={`h-1 w-1/3 bg-blue-500 transition-transform duration-150 ease-in-out
                ${moveBar === 0 ? "translate-x-0" : ""} 
                ${moveBar === 1 ? "translate-x-full" : ""} 
                ${moveBar === 2 ? "translate-x-[200%]" : ""}`}
            />
          </div>
        </div>
      </div>

      <div className="w-auto bg-[#DEE8ED] size-full">
        {moveBar === 0 && (
          <form className="flex-col flex font-Lato pt-8 pl-8 space-y-4">
            <div className="flex space-x-8">
              <div className="flex flex-col space-y-4">
                <label htmlFor="cedula" className="text-base text-black font-medium">Cédula</label>
                <input
                  className="w-[220px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                    focus:outline-blue-500 focus:outline-2"
                  type="text"
                  id="cedula"
                  name="id_number"
                  value={props.clientSelect?.id_number || ""}
                  onChange={props.handleChange}
                  placeholder="0-0000-0000"
                />
              </div>

              <div className="flex flex-col space-y-4">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  className="w-[220px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                    focus:outline-blue-500 focus:outline-2"
                  type="text"
                  id="telefono"
                  name="phone"
                  value={props.clientSelect?.phone || ""}
                  onChange={props.handleChange}
                  placeholder="0000-0000"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <label htmlFor="nombre" className="text-base text-black font-medium">Nombre</label>
              <input
                className="w-[472px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                        focus:outline-blue-500 focus:outline-2"
                type="text"
                id="name"
                name="name"
                value={props.clientSelect?.name || ""}
                onChange={props.handleChange}
                placeholder="Nombre"
              />
            </div>

            <div className="flex flex-col space-y-4">
              <label htmlFor="apellidos">Apellidos</label>
              <input
                className="w-[472px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                        focus:outline-blue-500 focus:outline-2"
                type="text"
                id="apellidos"
                name="last_name"
                value={props.clientSelect?.last_name || ""}
                onChange={props.handleChange}
                placeholder="Primer Apellido-Segundo Apellido"
              />
            </div>

            <div className="flex flex-col space-y-4">
              <label htmlFor="correoElectronico">Correo Eletrónico</label>
              <input
                className="w-[472px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                        focus:outline-blue-500 focus:outline-2"
                type="text"
                id="correoElectronico"
                name="email"
                value={props.clientSelect?.email || ""}
                onChange={props.handleChange}
                placeholder="example@gmail.com"
              />
            </div>

            <div className="flex flex-col space-y-4">
              <label htmlFor="direccion">Dirección</label>
              <textarea
                className="w-[472px] min-h-[96px] max-h-[132px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                        focus:outline-blue-500 focus:outline-2 pt-2"
                id="direccion"
                name="address"
                value={props.clientSelect?.address || ""}
                onChange={props.handleChange}
                placeholder="Dirección del cliente o empresa"
              />
            </div>
          </form>
        )}

        {moveBar === 1 && (
          <div className="p-8 font-Lato text-gray-600">
            No hay facturas para mostrar.
          </div>
        )}

        {moveBar === 2 && (
          <div className="pt-8 pl-8 pr-8">
            <div className="border rounded-2xl bg-white p-4 space-y-3">
              <div className="flex items-center gap-3">
                <input
                  id="credit_enabled"
                  type="checkbox"
                  checked={!!props.clientSelect?.credit_enabled}
                  onChange={(e) =>
                    props.setClientSelect((prev: any) => ({
                      ...prev,
                      credit_enabled: e.target.checked,
                      ...(e.target.checked
                        ? {
                            credit_unlimited: prev?.credit_unlimited ?? false,
                            credit_limit: prev?.credit_unlimited
                              ? null
                              : (typeof prev?.credit_limit === "number" ? prev.credit_limit : 0),
                          }
                        : {})
                    }))
                  }
                />
                <label htmlFor="credit_enabled" className="font-medium">
                  Habilitar crédito
                </label>

                  {/* --- Resumen de crédito --- */}
                  <div className="mt-4">
                    <CreditSummary summary={summary} />
                  </div>

                  {/* --- Tabla de créditos --- */}
                  <div className="mt-2">
                    {loading ? (
                      <div className="text-sm text-gray-500">Cargando créditos…</div>
                    ) : (
                      <CreditTable
                        rows={list}
                        onApprove={approve}
                        onReject={reject}
                        onClose={close}
                        onPay={(row) => { setCurrentCredit(row); setOpenPay(true); }}
                      />
                    )}
                  </div>

                  {/* --- Modales --- */}
                  <CreditRequestModal
                    open={openRequest}
                    onClose={() => setOpenRequest(false)}
                    onSubmit={({ credit_amount, due_date }) =>
                      requestCredit({ credit_amount, due_date })
                    }
                  />

                  <CreditPaymentModal
                    open={openPay}
                    credit={currentCredit}
                    onClose={() => setOpenPay(false)}
                    onSubmit={(amount) => currentCredit && addPayment(currentCredit.id, amount)}
                  />


              </div>

              {props.clientSelect?.credit_enabled && (
                <div className="pl-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      id="credit_limited"
                      type="radio"
                      name="credit_type"
                      checked={!props.clientSelect?.credit_unlimited}
                      onChange={() =>
                        props.setClientSelect((prev: any) => ({
                          ...prev,
                          credit_unlimited: false,
                          credit_limit: typeof prev?.credit_limit === "number" ? prev.credit_limit : 0,
                        }))
                      }
                    />
                    <label htmlFor="credit_limited">Límite</label>

                    <input
                      className="w-[200px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base focus:outline-blue-500 focus:outline-2"
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="₡ 0.00"
                      value={
                        props.clientSelect?.credit_unlimited
                          ? ""
                          : (props.clientSelect?.credit_limit ?? 0)
                      }
                      disabled={props.clientSelect?.credit_unlimited}
                      onChange={(e) =>
                        props.setClientSelect((prev: any) => ({
                          ...prev,
                          credit_limit: Number(e.target.value || 0),
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      id="credit_unlimited"
                      type="radio"
                      name="credit_type"
                      checked={!!props.clientSelect?.credit_unlimited}
                      onChange={() =>
                        props.setClientSelect((prev: any) => ({
                          ...prev,
                          credit_unlimited: true,
                          credit_limit: null,
                        }))
                      }
                    />
                    <label htmlFor="credit_unlimited">Sin límite</label>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
