import { TUserEndpoint } from "../models/types/TUserEndpoint";
import { useState } from "react";

interface editProfileProps {
  profileSelect: TUserEndpoint | null; 
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
                <h2 className="pl-8 font-Lato text-2xl ">Datos del Cliente</h2>
                <div className="flex space-x-8 pr-4">
                  <button className={`w-[94px] py-2 rounded-3xl font-Lato font-bold transition duration-300 
                  ${props.editProfile ? "bg-blue-500 text-white hover:bg-blue-800 hover:border-blue-800" 
                  : 
                  "bg-white border border-gray2 text-gray1 hover:bg-gray2 hover:border-gray2"}`}
                    onClick={validateOnSave}>
                    Editar
                  </button>
                  <button
                    className="w-[94px] py-2 rounded-3xl bg-[#FF4747] border border-[#FF4747] hover:bg-[#D32626] text-white font-Lato font-bold transition duration-300 "
                    onClick={() => props.profileSelect && props.handleDelete(props.profileSelect.id)}
                  >
                    Eliminar
                  </button>
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
                    <select className={`w-[220px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                      transition-colors ${errors.role_id ? "border-red-500" : "border-gray2"} focus:outline-2 focus:outline-blue-500`}
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
                        <option value="">Escoger rol</option>
                        <option value={1}>Administrador</option>
                        <option value={2}>Empleado</option>
                      </select>
                    {errors.role_id && (
                      <span className="text-red-500 text-base font-lato">{errors.role_id}</span>
                    )}
                  </div>

                  <div className="flex flex-col space-y-4">
                    <label htmlFor="username">Nombre de Usuario</label>
                    <input className={`w-[220px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                      transition-colors ${errors.username ? "border-red-500" : "border-gray2"} focus:outline-2 focus:outline-blue-500`}
                      type="text"
                      id="username"
                      name="username"
                      value={props.profileSelect?.username || ""}
                      onChange={(e) => {
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
                  <input className={`w-[220px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
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