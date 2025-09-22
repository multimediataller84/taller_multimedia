import { useState } from "react";
interface addClientProps{
    visibleAddProfile: boolean;
    setVisibleAddProfile: React.Dispatch<React.SetStateAction<boolean>>;  
    profileSelect: any;
    setProfileSelect: React.Dispatch<React.SetStateAction<any>>;
    addProfile: boolean; 
    handleAddProfile: (newProfile: any) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function addProfile (props: addClientProps){
    const [moveBar, setmMoveBar] = useState(0);
    return (
        <div className="w-[65%] flex flex-col">
            <div className="bg-gray3 w-full flex flex-col">
              <div className="flex w-full justify-between pt-8">
                <h2 className="pl-8 font-Lato text-2xl ">Añadir Perfil</h2>
                <div className="flex space-x-8 pr-4">
                  <button
                    className={`w-[94px] py-2 rounded-3xl font-Lato font-bold transition duration-300  ${
                      props.addProfile ? "bg-blue-500 text-white hover:bg-blue-800 hover:border-blue-800" 
                      : 
                      "bg-white border border-gray2 text-gray1 hover:bg-gray2 hover:border-gray2"
                    }`}
                    onClick={() => {
                      if (props.profileSelect) {
                        props.handleAddProfile(props.profileSelect);
                        props.setProfileSelect(null); 
                      }
                    }}
                  >
                    Confirmar
                  </button>
                  <button className="w-[94px] py-2 rounded-3xl bg-white border border-gray2 hover:bg-gray2 hover:border-gray2 text-gray1 font-Lato font-bold transition duration-300 "
                  onClick={() => {props.setVisibleAddProfile(false)
                    props.setProfileSelect(null)
                  }
                  }
                  >Cancelar</button>
                </div>
              </div>

              <div className="flex flex-col w-full">
                <div className="flex w-full mt-8 space-y-4 font-lato font-medium">
                  <h2 className={`w-1/3 text-center ${moveBar === 0 ? "text-blue-500" : "text-gray1"}`}
                  onClick={() => (setmMoveBar(0))}
                  >Información General</h2>
                  <h3 className={`w-1/3 text-center ${moveBar === 1 ? "text-blue-500" : "text-gray1"}`}
                  onClick={() => (setmMoveBar(1))}
                  >Facturas</h3>
                  <h4 className={`w-1/3 text-center ${moveBar === 2 ? "text-blue-500" : "text-gray1"}`}
                  onClick={() => (setmMoveBar(2))}
                  >Créditos</h4>
                </div>
                <div className="w-full h-1 bg-graybar relative">
                <div
                  className={`h-1 w-1/3 bg-blue-500 transition-transform duration-150 ease-in-out
                    ${moveBar === 0 ? "translate-x-0" : ""} ${moveBar === 1 ? "translate-x-full" : ""} ${moveBar === 2 ? "translate-x-[200%]" : ""}`}
                ></div>
              </div>
             </div>
            </div>

              <div className="bg-[#DEE8ED] size-full">
              <form className="flex-col flex font-Lato pt-8 pl-8 space-y-4">
                
                <div className="flex space-x-8">
                  <div className="flex flex-col space-y-4">
                    <label htmlFor="role_id" className="text-base text-black font-medium">Rol</label>
                    <select className="w-[220px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                    focus:outline-blue-500 focus:outline-2"
                      id="role_id"
                      name="role_id"
                      value={props.profileSelect?.role_id || ""}
                      onChange={props.handleChange}>
                        <option >Escoger rol</option>
                        <option value={1}>Administrador</option>
                        <option value={2}>Empleado</option>
                      </select>  
                  </div>

                  <div className="flex flex-col space-y-4">
                    <label htmlFor="username">Nombre de Usuario</label>
                    <input className="w-[220px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                    focus:outline-blue-500 focus:outline-2"
                      type="text"
                      id="username"
                      name="username"
                      value={props.profileSelect?.username || ""}
                      onChange={props.handleChange}
                      placeholder="Nombre de usuario"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <label htmlFor="nombre" className="text-base text-black font-medium">Nombre</label>
                  <input className="w-[472px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                          focus:outline-blue-500 focus:outline-2"
                    type="text"
                    id="name"
                    name="name"
                    value={props.profileSelect?.name || ""}
                    onChange={props.handleChange}
                    placeholder="Nombre"
                  />
                </div>

                <div className="flex flex-col space-y-4">
                <label htmlFor="password" className="text-base text-black font-medium">Contraseña</label>
                <input
                    className="w-[472px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                            focus:outline-blue-500 focus:outline-2"
                    type="password"
                    id="password"
                    name="password"
                    value={props.profileSelect?.password || ""}
                    onChange={props.handleChange}
                    placeholder="Contraseña"
                />
                </div>
              </form>
            </div>
          </div>

    );
}
