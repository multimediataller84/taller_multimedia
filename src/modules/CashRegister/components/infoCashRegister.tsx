import { TCashRegisterWithUser } from "../models/interfaces/ICashRegisterService";
import { useState } from "react";

interface editProfileProps {
  profileSelect: TCashRegisterWithUser | null; 
  setProfileSelect: React.Dispatch<React.SetStateAction<any>>;
  setVisibleEditProfile: React.Dispatch<React.SetStateAction<boolean>>;  
}

export default function InfoCashRegister(props: editProfileProps) {

    return (
            <div className="w-[70%] flex flex-col ">
            <div className="bg-gray3 w-full  flex flex-col">
              <div className="flex w-full justify-between pt-8">
                <h2 className="pl-8 font-Lato text-2xl ">Datos de Caja</h2>
                <div className="flex space-x-8 pr-4">
                  <button className="w-[94px] py-2 rounded-3xl font-Lato font-bold transition duration-300"
                  >
                    Abrir
                  </button>

                   <button className="w-[94px] py-2 rounded-3xl bg-black border-black text-white hover:bg-gray-700 hover:border-gray-700 font-Lato font-bold transition duration-300"
                  onClick={() => {props.setVisibleEditProfile(false)
                    props.setProfileSelect(null)
                  }
                  }
                  >Cancelar</button>
                </div>
              </div>

              <div className="w-full flex pt-8 pl-8 pb-4 font-Lato text-base space-x-8">
                <button className="w-[220px] text-center font-medium">Información General</button>
              </div>
              <div className="w-full h-1 bg-graybar"></div>
            </div>

             <div className="w-auto bg-[#DEE8ED] h-min">
              <form className="flex-col flex font-Lato pt-8 pl-8 space-y-4">
                <div className="flex space-x-8">
                  <div className="flex flex-col space-y-4">
                    <label htmlFor="role_id" className="text-base text-black font-medium">Rol</label>
                    <div className="relative">
                    <select className="appearance-none w-[220px] py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                      transition-colors "
                      id="role_id"
                      name="role_id"
                      value={props.profileSelect?.amount || ""}
                
                      >
                        <option value="">Escoger rol</option>
                        <option value={1}>Administrador</option>
                        <option value={2}>Empleado</option>
                      </select>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 fill-gray1">
                          <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clip-rule="evenodd" />
                      </svg>
                      </div>
                  </div>

                  <div className="flex flex-col space-y-4">
                    <label htmlFor="username">Nombre de Usuario</label>
                    <input className="w-[220px] py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                      transition-colors "
                      type="text"
                      id="username"
                      name="username"
                      value={props.profileSelect?.closing_amount || ""}
                     
                      placeholder="Nombre de usuario"
                    />
                 
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <label htmlFor="nombre" className="text-base text-black font-medium">Nombre</label>
                  <input className="w-[220px] py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                    transition-colors"
                    type="text"
                    id="name"
                    name="name"
                    value={props.profileSelect?.user?.name || "Sin nombre"}
                    
                    placeholder="Nombre"
                  />
                 
                </div>
              </form>
            </div>
          </div>
    );
}