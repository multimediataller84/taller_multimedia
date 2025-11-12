import { useState } from "react";
import ConfirmDialog from "../../Credit/components/ConfirmDialog";

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
    
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
    const validateOnSave = (): boolean => {
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

    if (!props.profileSelect?.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (props.profileSelect.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(props.profileSelect.password)
    ) {
      newErrors.password =
        "Debe incluir al menos una mayúscula, una minúscula y un número";
    }


    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }
  
  const [showPassword, setShowPassword] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
      open: false,
      payload: null as any,
  });

    return (
        <div className="flex flex-col w-full bg-gray3">
            <div className="w-full flex flex-col">
              <div className="flex w-full justify-between items-center pt-2 md:pt-4 2xl:pt-8">
                <h2 className="font-Lato text-sm md:text-base xl:text-base 2xl:text-2xl pl-8">Añadir Perfil</h2>
                <div className="flex space-x-2 md:space-x-4 2xl:space-x-8 pr-4">
                  <button
                    className={`py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato font-bold transition duration-300  ${
                      props.addProfile ? "bg-blue-500 border border-blue-500 text-white hover:bg-blue-800 hover:border-blue-800" 
                      : 
                      "bg-gray3 border border-gray2 text-gray1 "
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (validateOnSave() && props.profileSelect) {
                        setConfirmDialog({
                          open: true,
                          payload: props.profileSelect,
                        })
                      }
                    }}
                  >
                    Confirmar
                  </button>
                  <button className="py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato font-bold bg-black border-black text-white hover:bg-gray-700 hover:border-gray-700 transition duration-300"
                  onClick={() => {props.setVisibleAddProfile(false)
                    props.setProfileSelect(null)
                  }
                  }
                  >Cancelar</button>
                </div>

                <ConfirmDialog
                open={confirmDialog.open}
                onCancel={() => setConfirmDialog({ open: false, payload: null })}
                onConfirm={() => {
                  if (confirmDialog.payload) {
                    props.handleAddProfile(confirmDialog.payload);
                    props.setProfileSelect(null);
                  }
                  setConfirmDialog({ open: false, payload: null });
                }}
                title="¿Agregar perfil?"
                message="¿Seguro que deseas agregar este nuevo perfil?"
                 confirmLabel="Agregar"
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

              <div className="bg-[#DEE8ED] size-full">
              <form className="flex flex-col font-lato pt-2 lg:pt-8 px-4 sm:px-8 space-y-2 2xl:space-y-6 max-w-5xl mx-auto">
                
                <div className="flex flex-wrap gap-2 2xl:gap-6">
                    <div className="flex flex-col space-y-2 flex-1 min-w-[220px]">
                    <label htmlFor="role_id" className="text-base text-black font-medium">Rol</label>
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
                        <option value={2}>Cajero</option>
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
                      <label htmlFor="username" className="text-sm sm:text-base text-black font-medium">Nombre de Usuario</label>
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

                   <div className="flex flex-col space-y-2 flex-1 min-w-[220px] relative">
                    <label
                      htmlFor="password"
                      className="text-sm sm:text-base text-black font-medium"
                    >
                      Contraseña
                    </label>

                    <div className="relative w-full">
                      <input
                        className={`appearance-none w-full py-2 border rounded-3xl px-4 pr-10 text-gray1 border-gray2 bg-white text-sm sm:text-base focus:outline-2 focus:outline-blue-500 ${
                          errors.password ? "border-red-500" : "border-gray2"
                        }`}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        minLength={6}
                        value={props.profileSelect?.password || ""}
                        onChange={(e) => {
                          props.handleChange(e);
                          if (errors.password) {
                            setErrors((prev) => ({ ...prev, password: "" }));
                          }
                        }}
                        placeholder="Contraseña"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray1 hover:text-blue-500 focus:outline-none"
                      >
                        {showPassword ? (
                          
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5  fill-gray1">
                            <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                            <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                            <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                          </svg>
                        ) : (
                          
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5  fill-gray1">
                            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clip-rule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {errors.password && (
                      <span className="text-red-500 text-base font-lato">
                        {errors.password}
                      </span>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

    );
}
