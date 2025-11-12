import { TCashRegisterWithUser, TCloseRegister, TOpenRegister } from "../models/interfaces/ICashRegisterService";
import OpenCashRegister from "./OpenCashRegister";
import CloseCashRegister from "./CloseCashRegister";
import { getRoleAuth } from "../../../utils/getRoleAuth";
import ConfirmDialog from "../../Credit/components/ConfirmDialog";
import { useState } from "react";


interface editProfileProps {
  cashRegisterSelect: TCashRegisterWithUser | null; 
  setCashRegisterSelect: React.Dispatch<React.SetStateAction<any>>;
  setVisibleInfoCashRegister: React.Dispatch<React.SetStateAction<boolean>>;  
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOpenCashRegister: (id: number, data: TOpenRegister) => Promise<void>;
  visibleOpen: boolean;
  setVisibleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleCloseCashRegister: (id: number, data: TCloseRegister) => Promise<void>; 
  visibleClose: boolean;
  setVisibleClose: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: (id: number) => void;
}

export default function InfoCashRegister(props: editProfileProps) {

  const [confirmDialog, setConfirmDialog] = useState({
      open: false,
      payload: null as any,
    });

    return (
            <div className="flex flex-col w-full bg-gray3">
            <div className="w-full flex flex-col">
              <div className="flex w-full justify-between items-center pt-2 md:pt-4 2xl:pt-8">
                <h2 className="ont-Lato text-xs sm:text-sm md:text-base xl:text-base 2xl:text-2xl pl-8">Datos de Caja</h2>
                <div className="flex space-x-2 md:space-x-4 2xl:space-x-8 pr-4">
                 <button 
                  onClick={() => {
                    if (props.cashRegisterSelect?.status === "closed") {
                      props.setVisibleOpen(!props.visibleOpen);
                    } else {
                      props.setVisibleClose(!props.visibleClose);
                    }
                  }}
                  className={`py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato font-bold transition duration-300 text-white
                    ${props.cashRegisterSelect?.status === "closed" ? "bg-blue-500 hover:bg-blue-600" : "bg-black hover:bg-gray-800"}
                  `}
                >
                  {props.cashRegisterSelect?.status === "closed" ? "Abrir" : "Cerrar"}
                </button>

                <button 
                className={`text-white bg-black py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato font-bold hover:bg-[#D32626] hover:border-[#D32626] transition duration-300
                  ${
                    getRoleAuth() === "admin" && props.cashRegisterSelect?.status === "closed"
                      ? "inline"
                      : "hidden"
                  }
                `}
                onClick={() => {
                  if (props.cashRegisterSelect) {
                    setConfirmDialog({
                      open: true,
                      payload: props.cashRegisterSelect.id
                    });
                  }
                }}
              >
                Eliminar
              </button>

                  <button className="py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px]  text-xs sm:text-sm md:text-base font-Lato font-bold bg-black border-black text-white hover:bg-gray-700 hover:border-gray-700 transition duration-300"
                    onClick={() => {props.setVisibleInfoCashRegister(false)
                    props.setCashRegisterSelect(null)}}
                  >Cancelar</button>
                </div>
                <ConfirmDialog
                  open={confirmDialog.open}
                  onCancel={() => setConfirmDialog({ open: false, payload: null })}
                  onConfirm={() => {
                    if (confirmDialog.payload) {
                      props.handleDelete(confirmDialog.payload);
                    }
                    setConfirmDialog({ open: false, payload: null });
                  }}
                  title="¿Eliminar caja?"
                  message="¿Seguro que deseas eliminar esta caja? Esta acción no se puede deshacer."
                  confirmLabel="Eliminar"
                  cancelLabel="Cancelar"
                />
              </div>

              <div className="flex flex-col w-full">
                <div className="flex w-full text-xs md:text-base mt-4 md:mt-6 2xl:mt-8 space-y-4 font-lato font-medium">
                  <h2 className="w-1/2 text-center text-blue-500">
                    Información General
                  </h2>
                </div>
                <div className="w-full h-0.5 lg:h-1 bg-graybar mt-1 2xl:mt-4">
                  <div className="w-1/2 h-0.5 lg:h-1 bg-blue-500"></div>
                </div>
              </div>

            </div>

             <div className="bg-[#DEE8ED] size-full ">
              <form className="flex flex-col font-lato pt-2 lg:pt-8 px-4 sm:px-8 space-y-6 max-w-5xl mx-auto">
                
                <div className="flex flex-wrap gap-2 2xl:gap-6">

                  <div className="flex flex-col space-y-2 flex-1 min-w-[220px]">
                    <label htmlFor="opening_amount" className="text-sm sm:text-base text-black font-medium">Monto Apertura</label>
                    <div className="relative">
                   <input
                    className="appearance-none w-full py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white text-sm sm:text-base 
                    focus:outline-none"
                      type="text"
                      id="opening_amount"
                      name="opening_amount"
                      value={
                        props.cashRegisterSelect?.opening_amount !== undefined
                          ? new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(props.cashRegisterSelect.opening_amount)
                          : ""
                      }
                      placeholder="Monto inicial"
                      readOnly
                    />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 flex-1 min-w-[220px]">
                    <label htmlFor="amount" className="text-sm sm:text-base text-black font-medium">Monto Actual</label>
                    <div className="relative">
                   <input
                    className="appearance-none w-full py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white text-sm sm:text-base 
                    focus:outline-none"
                      type="text"
                      name="amount"
                      value={
                        props.cashRegisterSelect?.amount !== undefined
                          ? new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(props.cashRegisterSelect.amount)
                          : ""
                      }
                      placeholder="Monto Actual"
                      readOnly
                    />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 flex-1 min-w-[220px]">
                    <label htmlFor="closing_amount" className="text-sm sm:text-base text-black font-medium">Monto Caja Cerrada</label>
                        <div className="relative">
                        <input className="appearance-none w-full py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white text-sm sm:text-base 
                        focus:outline-none"
                        type="text"
                        id="closing_amount"
                        name="closing_amount"
                        value={
                        props.cashRegisterSelect?.closing_amount !== undefined
                          ? new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(props.cashRegisterSelect.closing_amount)
                          : ""
                      }
                        placeholder="Monto Final"
                        readOnly
                        />
                        </div>
                  </div>
                </div>
                

                <div className="flex flex-wrap gap-2 2xl:gap-6">
                    <div className="flex flex-col space-y-2 flex-1 min-w-[220px]">
                    <label htmlFor="opened_at" className="text-sm sm:text-base text-black font-medium">Fecha Caja Abierta</label>
                    <div className="relative">
                    <input className="appearance-none w-full py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white text-sm sm:text-base 
                        focus:outline-none"
                        type="text"
                        id="opened_at"
                        name="opened_at"
                        value={
                            props.cashRegisterSelect?.opened_at
                            ? new Date(props.cashRegisterSelect.opened_at).toLocaleString("es-CR")
                            : ""
                        }
                        placeholder="Fecha Caja Abierta" 
                        readOnly
                    />
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 fill-gray1">
                        <path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clip-rule="evenodd" />
                    </svg>
                    </div>
                    </div>

                    <div className="flex flex-col space-y-2 flex-1 min-w-[220px]">
                    <label htmlFor="closed_at" className="text-sm sm:text-base text-black font-medium">Fecha Caja Cerrada</label>
                    <div className="relative">
                    <input className="appearance-none w-full py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white text-sm sm:text-base focus:outline-none"                        
                    type="text"
                        id="closed_at"
                        name="closed_att"
                        value={
                            props.cashRegisterSelect?.closed_at
                            ? new Date(props.cashRegisterSelect.closed_at).toLocaleString("es-CR")
                            : ""
                        }
                        placeholder="Fecha Caja Cerrada"
                        readOnly
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 fill-gray1">
                        <path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clip-rule="evenodd" />
                    </svg>
                    </div>
                    </div>
                </div>
                
                <label className="text-sm sm:text-base text-black font-medium">Empleado Asignado</label>
                  <div className="w-full flex flex-col">
                      <div className="w-auto h-auto rounded-xl pb-4 font-lato text-base shadow transition duration-150 delay-75 bg-linear-to-l from-[#193cb8] to-blue-500 text-white">
                      <h2 className="h-auto ml-4 mt-4 font-medium">
                        {props.cashRegisterSelect?.user?.name || "No hay empleado"}
                      </h2>
                      <h3 className="mt-1 ml-4">
                        {props.cashRegisterSelect?.user
                          ? props.cashRegisterSelect.user.role_id === 1
                          ? "Administrador"
                          : "Cajero"
                          : "No asignado"}
                      </h3>
                    </div>
                  </div>
              </form>
            </div>
                
            {props.visibleOpen && <OpenCashRegister
            visibleOpen = {props.visibleOpen}
            setVisibleOpen = {props.setVisibleOpen}
            cashRegisterSelect = {props.cashRegisterSelect}
            setCashRegisterSelect = {props.setCashRegisterSelect}
            handleOpenCashRegister = {props.handleOpenCashRegister}
            handleChange = {props.handleChange}
            setVisibleInfoCashRegister = {props.setVisibleInfoCashRegister}
            />}

            {props.visibleClose && <CloseCashRegister
              visibleClose = {props.visibleClose}
              setVisibleClose = {props.setVisibleClose}
              cashRegisterSelect = {props.cashRegisterSelect}
              setCashRegisterSelect = {props.setCashRegisterSelect}
              handleCloseCashRegister = {props.handleCloseCashRegister}
              handleChange = {props.handleChange}
              setVisibleInfoCashRegister = {props.setVisibleInfoCashRegister}
            />}
          </div>
    );
}