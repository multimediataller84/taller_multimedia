import { TUserEndpoint } from "../models/types/TUserEndpoint";
import { useState } from "react";
import { getRoleAuth } from "../../../utils/getRoleAuth";
import { getUsernameAuth } from "../../../utils/getUsernameAuth";


interface editProfileProps {
  profileSelect: TUserEndpoint | null; 
  setProfileSelect: React.Dispatch<React.SetStateAction<any>>;
  setVisibleEditProfile: React.Dispatch<React.SetStateAction<boolean>>;  
  editProfile: boolean;
  handleSave: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleDelete: (id: number) => void;
}

export default function editClient(props: editProfileProps) {

      const [errors, setErrors] = useState<{ [key: string]: string }>({});
    
      const validateOnSave = () => {
      const newErrors: { [key: string]: string } = {};
  
      if (!props.profileSelect?.role_id) {
        newErrors.role_id = "El rol es obligatorio";
      }
  
      if (!props.profileSelect?.username) {
        newErrors.username = "El username es obligatorio";
      }
  
      if (!props.profileSelect?.name) {
        newErrors.name = "El nombre es obligatorio";
      }
  
      setErrors(newErrors);
  
      if (Object.keys(newErrors).length === 0) {
      props.handleSave();
    }
    }
    return (
            <div className="flex flex-col w-full bg-gray3">
            <div className="w-full flex flex-col">
              <div className="flex w-full justify-between items-center pt-2 md:pt-4 2xl:pt-8">
                <h2 className="font-Lato text-sm md:text-base xl:text-base 2xl:text-2xl pl-8">Datos del Perfil</h2>
                  <div className="flex space-x-2 md:space-x-4 2xl:space-x-8 pr-4">
                  <button className={`py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato font-bold transition duration-300 
                  ${props.editProfile ? "bg-blue-500 text-white hover:bg-blue-800 hover:border-blue-800" 
                  : 
                  "bg-gray3 border border-gray2 text-gray1 "}`}
                    onClick={validateOnSave}>
                    Editar
                  </button>
                  <button
                    className="py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato font-bold transition duration-300 bg-black hover:border-[#D32626] hover:bg-[#D32626] text-white "
                    onClick={() => props.profileSelect && props.handleDelete(props.profileSelect.id)}
                  >
                    Eliminar
                  </button>
                    <button className="py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato font-bold bg-black border-black text-white hover:bg-gray-700 hover:border-gray-700 transition duration-300"
                  onClick={() => {props.setVisibleEditProfile(false)
                    props.setProfileSelect(null)
                  }
                  }
                  >Cancelar</button>
                </div>
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
             <div className="bg-[#DEE8ED] size-full">
              <form className="flex flex-col font-lato pt-2 lg:pt-8 px-4 sm:px-8 space-y-2 2xl:space-y-6 max-w-5xl mx-auto">
                
                <div className="flex flex-wrap gap-2 2xl:gap-6">
                    <div className="flex flex-col space-y-2 flex-1 min-w-[220px]">
                    <label htmlFor="role_id" className="text-sm sm:text-base text-black font-medium">Rol</label>
                    <div className="relative">
                      <select className={`appearance-none w-full py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white text-sm sm:text-base focus:outline-2 focus:outline-blue-500 ${errors.role_id ? "border-red-500" : "border-gray2"} focus:outline-2 focus:outline-blue-500`}
                        id="role_id"
                        name="role_id"
                        value={props.profileSelect?.role_id || ""}
                        onChange={(e) => {
                        props.handleChange(e); 
                        if (errors.role_id) {
                          setErrors((prev) => ({ ...prev, role_id: "" })); 
                        }
                      }}
                        >
                        <option>Escoger rol</option>
                        <option value={1}>Administrador</option>
                        <option value={2}>Empleado</option>
                      </select> 
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 fill-gray1">
                          <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clip-rule="evenodd" />
                      </svg>
                    </div>
                      {errors.username && (
                    <span className="text-red-500 text-base font-lato">{errors.role_id}</span>
                  )}
                  </div>

                    <div className="flex flex-col space-y-2 flex-1 min-w-[220px]">
                      <label htmlFor="username" className="text-sm sm:text-base text-black font-medium">Nombre de usuario</label>
                      <input
                      className={`appearance-none w-full py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white text-sm sm:text-base focus:outline-2 focus:outline-blue-500 ${errors.username ? "border-red-500" : "border-gray2"} focus:outline-2 focus:outline-blue-500`}
                      type="text"
                      id="username"
                      name="username"
                      value={props.profileSelect?.username || ""}
                      onChange={(e) => {
                        e.target.value = e.target.value.toLowerCase();
                        props.handleChange(e);
                        if (errors.username) {
                          setErrors((prev) => ({ ...prev, username: "" }));
                        }
                      }}
                      placeholder="Nombre de usuario"
                    />
                      {errors.username && (
                      <span className="text-red-500 text-base font-lato">{errors.username}</span>
                    )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 2xl:gap-6">
                                        <div className="flex flex-col space-y-2 flex-1 min-w-[220px]">
                    <label htmlFor="nombre" className="text-sm sm:text-base text-black font-medium">Nombre</label>
                    <input className={`appearance-none w-full py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white text-sm sm:text-base focus:outline-2 focus:outline-blue-500 ${errors.name ? "border-red-500" : "border-gray2"} focus:outline-2 focus:outline-blue-500`}
                      type="text"
                      id="name"
                      name="name"
                      value={props.profileSelect?.name || ""}
                      onChange={(e) => {
                        props.handleChange(e); 
                        if (errors.name) {
                          setErrors((prev) => ({ ...prev, name: "" })); 
                        }
                      }}
                      placeholder="Nombre"
                    />
                    {errors.username && (
                      <span className="text-red-500 text-base font-lato">{errors.name}</span>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
    );
}