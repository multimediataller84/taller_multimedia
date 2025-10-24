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
            <div className="w-[70%] flex flex-col ">
            <div className="bg-gray3 w-full  flex flex-col">
              <div className="flex w-full justify-between pt-8">
                <h2 className="pl-8 font-Lato text-2xl ">Datos del Perfil</h2>
                <div className="flex space-x-8 pr-4">
                  <button className={`w-[94px] py-2 rounded-3xl font-Lato font-bold transition duration-300 
                  ${props.editProfile ? "bg-blue-500 text-white hover:bg-blue-800 hover:border-blue-800" 
                  : 
                  "bg-gray3 border border-gray2 text-gray1 "}`}
                    onClick={validateOnSave}>
                    Editar
                  </button>
                  <button
                    className="w-[94px] py-2 rounded-3xl bg-black border-black border hover:border-[#D32626] hover:bg-[#D32626] text-white font-Lato font-bold transition duration-300 "
                    onClick={() => props.profileSelect && props.handleDelete(props.profileSelect.id)}
                  >
                    Eliminar
                  </button>
                   <button className="w-[94px] py-2 rounded-3xl bg-black border-black text-white hover:bg-gray-700 hover:border-gray-700 font-Lato font-bold transition duration-300"
                  onClick={() => {props.setVisibleEditProfile(false)
                    props.setProfileSelect(null)
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

             <div className="bg-[#DEE8ED] size-full">
              <form className="flex-col flex font-Lato pt-8 pl-8 space-y-4">
                <div className="flex space-x-8">
                  <div className="flex flex-col space-y-4">
                    <label htmlFor="role_id" className="text-base text-black font-medium">Rol</label>
                    <div className="relative">
                    <select className={`appearance-none w-[220px] py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                      transition-colors ${errors.role_id ? "border-red-500" : "border-gray2"}  disabled:bg-gray2 focus:outline-2 focus:outline-blue-500`} 
                      id="role_id"
                      name="role_id"
                      disabled={
                          getRoleAuth() === "admin" &&
                          props.profileSelect?.username === getUsernameAuth()
                      }
                      value={props.profileSelect?.role_id || ""}
                      onChange={(e) => {
                        props.handleChange(e); 
                        if (errors.role_id) {
                          setErrors((prev) => ({ ...prev, role_id: "" })); 
                        }
                      }}
                      >
                        <option value="">Escoger rol</option>
                        <option value={1}>Administrador</option>
                        <option value={2}>Empleado</option>
                      </select>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 fill-gray1">
                          <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clip-rule="evenodd" />
                      </svg>
                      </div>
                    {errors.role_id && (
                      <span className="text-red-500 text-base font-lato">{errors.role_id}</span>
                    )}
                  </div>

                  <div className="flex flex-col space-y-4">
                    <label htmlFor="username">Nombre de Usuario</label>
                    <input className={`w-[220px] py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                      transition-colors ${errors.username ? "border-red-500" : "border-gray2"} focus:outline-2 focus:outline-blue-500`}
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

                <div className="flex flex-col space-y-4">
                  <label htmlFor="nombre" className="text-base text-black font-medium">Nombre</label>
                  <input className={`w-[220px] py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                    transition-colors ${errors.name ? "border-red-500" : "border-gray2"} focus:outline-2 focus:outline-blue-500`}
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
                  {errors.name && (
                      <span className="text-red-500 text-base font-lato">{errors.name}</span>
                  )}
                </div>
              </form>
            </div>
          </div>
    );
}