import { TCashRegisterWithUser } from "../models/interfaces/ICashRegisterService";

interface editProfileProps {
  cashRegisterSelect: TCashRegisterWithUser | null; 
  setCashRegisterSelect: React.Dispatch<React.SetStateAction<any>>;
  setVisibleEditProfile: React.Dispatch<React.SetStateAction<boolean>>;  
}

export default function InfoCashRegister(props: editProfileProps) {

    return (
            <div className="w-[70%] flex flex-col ">
            <div className="bg-gray3 w-full  flex flex-col">
              <div className="flex w-full justify-between pt-8">
                <h2 className="pl-8 font-Lato text-2xl ">Datos de Caja</h2>
                <div className="flex space-x-8 pr-4">
                  <button className="w-[94px] py-2 rounded-3xl font-Lato font-bold transition duration-300 bg-black text-white">
                    Cerrar
                  </button>

                   <button className="w-[94px] py-2 rounded-3xl bg-black border-black text-white hover:bg-gray-700 hover:border-gray-700 font-Lato font-bold transition duration-300"
                    onClick={() => {props.setVisibleEditProfile(false)
                    props.setCashRegisterSelect(null)
                  }
                  }
                  >Cancelar</button>
                </div>
              </div>

              <div className="flex flex-col w-full">
                <div className="flex w-full mt-8 space-y-4 font-lato font-medium">
                  <h2 className="w-1/3 text-center text-blue-500">
                    Información General
                  </h2>
                </div>
                <div className="w-full h-1 bg-graybar mt-4">
                  <div className="w-1/3 h-1 bg-blue-500"></div>
                </div>
              </div>
            </div>

             <div className="w-auto bg-[#DEE8ED] h-min">
              <form className="flex-col flex font-Lato pt-8 pl-8 space-y-4">
                <div className="flex space-x-8">
                  <div className="flex flex-col space-y-4">
                    <label htmlFor="opening_amount" className="text-base text-black font-medium font-Lato ">Monto Inicial</label>
                    <div className="relative">
                    <input className="w-[220px] py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base transition-colors"
                      type="text"
                      id="opening_amount"
                      name="opening_amount"
                      value={props.cashRegisterSelect?.opening_amount|| ""}
                      placeholder="Monto inicial"/>
                    </div>
                </div>

                <div className="flex flex-col space-y-4">
                    <label htmlFor="closing_amount" className="text-base text-black font-medium font-Lato ">Monto final</label>
                        <div className="relative">
                        <input className="w-[220px] py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base transition-colors"
                        type="text"
                        id="closing_amount"
                        name="closing_amount"
                        value={props.cashRegisterSelect?.closing_amount|| ""}
                        placeholder="Monto inicial"/>
                        </div>
                    </div>
                </div>
                
                <div className="flex space-x-8">
                    <div className="flex flex-col space-y-4">
                    <label htmlFor="opened_at" className="text-base text-black font-medium font-Lato ">Fecha Caja Abierta</label>
                    <div className="relative">
                    <input className="w-[220px] py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                        transition-colors"
                        type="text"
                        id="opened_at"
                        name="opened_at"
                        value={
                            props.cashRegisterSelect?.opened_at
                            ? new Date(props.cashRegisterSelect.opened_at).toLocaleDateString("es-CR")
                            : ""
                        }
                        placeholder="Fecha Caja Abierta" 
                    />
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 fill-gray1">
                        <path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clip-rule="evenodd" />
                    </svg>
                    </div>
                    </div>

                    <div className="flex flex-col space-y-4">
                    <label htmlFor="closed_at" className="text-base text-black font-medium font-Lato ">Fecha Caja Cerrada</label>
                    <div className="relative">
                    <input className="w-[220px] py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                        transition-colors"
                        type="text"
                        id="closed_at"
                        name="closed_att"
                        value={
                            props.cashRegisterSelect?.closed_at
                            ? new Date(props.cashRegisterSelect.closed_at).toLocaleDateString("es-CR")
                            : ""
                        }
                        placeholder="Fecha Caja Abierta"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 fill-gray1">
                        <path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clip-rule="evenodd" />
                    </svg>
                    </div>
                    </div>
                </div>
                
                <label className="text-base text-black font-Lato font-medium">Empleado Asignado</label>
                <div className="w-1/4 pr-18 flex flex-col">
                        <div
                        className="w-full h-auto rounded-xl pb-4 font-lato text-base shadow transition duration-150 delay-75 bg-blue-500 text-white hover:bg-blue-800"
                            >
                        <h2 className="w-full h-auto ml-4 mt-4 font-medium">
                            {props.cashRegisterSelect?.user.name}
                        </h2>
                        <h3 className="mt-1 ml-4">
                            {" "}
                            {props.cashRegisterSelect?.user.role_id === 1 ? "Administrador" : "Empleado"}
                        </h3>
                    </div>
                    </div>
              </form>
            </div>
          </div>
    );
}