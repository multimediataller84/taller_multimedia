import { useState } from "react";
import { TProvince } from "../models/types/TProvince";
import { TCanton } from "../models/types/TCanton";
import { TDistrict } from "../models/types/TDistrict";

interface addProfileProps{
    visibleAdd: boolean;
    setVisibleAdd: React.Dispatch<React.SetStateAction<boolean>>;  
    clientSelect: any;
    setClientSelect: React.Dispatch<React.SetStateAction<any>>;
    add: boolean; 
    handleAddClient: (newClient: any) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    provinces: TProvince[];
    cantons: TCanton[];
    districts: TDistrict[];
    loadingLocations: boolean;
}

export default function addProfile (props: addProfileProps){

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
    const validateOnSave = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    const type = props.clientSelect?.identification_type;
    const id = props.clientSelect?.id_number?.trim();

  if (!type) {
    newErrors.identification_type = "Seleccione un tipo de cédula";
  }

  if (!id) {
    newErrors.id_number = "La cédula es obligatoria";
  } else {
    switch (type) {
      case "Cédula Física":
        if (!/^[1-7]\d{4}\d{4}$/.test(id))
          newErrors.id_number = "Formato inválido. Ejemplo: 112345678";
        break;
      case "Cédula Jurídica":
        if (!/^3\d{3}\d{6,}$/.test(id))
          newErrors.id_number = "Formato inválido. Ejemplo: 3101234567";
        break;
      case "DIMEX":
        if (!/^(\d{1}\d{3}\d{6,}|\d{10,12})$/.test(id))
          newErrors.id_number = "Formato inválido para DIMEX";
        break;
      case "NITE":
        if (!/^4\d{3}\d{6}$/.test(id))
          newErrors.id_number = "Formato inválido. Ejemplo: 4000123456";
        break;
      case "Extranjero no domiciliado":
        if (!/^\d{9}$/.test(id))
          newErrors.id_number = "Formato inválido. Deben ser 9 dígitos";
        break;
      case "No contribuyente":
        if (id !== "999999999")
          newErrors.id_number = "El formato debe ser 999999999";
        break;
      default:
        newErrors.id_number = "Seleccione un tipo de cédula válido";
    }
  }
    
    if (!props.clientSelect?.phone) {
      newErrors.phone = "El teléfono es obligatorio";
    } else if (!/^\d{4}\d{4}$/.test(String(props.clientSelect.phone))) {
      newErrors.phone = "Formato de télefono incorrecto";
    }

    if (!props.clientSelect?.email) {
      newErrors.email = "El correo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(props.clientSelect.email)) {
      newErrors.email = "Correo inválido";
    }

    if (!props.clientSelect?.name) {
      newErrors.name = "El nombre es obligatorio";
    }

    if (!props.clientSelect?.last_name) {
      newErrors.last_name = "Los apellidos son obligatorios";
    }

    if (!props.clientSelect?.address) {
      newErrors.address = "La dirección es obligatoria";
    }

    if (!props.clientSelect?.province_id) {
      newErrors.province_id = "La provincia es obligatoria";
    }

    if (!props.clientSelect?.canton_id) {
      newErrors.canton_id = "El cantón es obligatoria";
    }

    if (!props.clientSelect?.district_id) {
      newErrors.district_id = "El distrtio es obligatorio";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

    return (
        <div className="w-[70%] flex flex-col">
            <div className="bg-gray3 w-full flex flex-col">
              <div className="flex w-full justify-between pt-8">
                <h2 className="pl-8 font-Lato text-2xl ">Añadir Cliente</h2>
                <div className="flex space-x-8 pr-4">
                  <button
                    className={`w-[94px] py-2 rounded-3xl font-Lato font-bold transition duration-300  ${
                      props.add ? "bg-blue-500 text-white border border-blue-500 hover:bg-blue-800 hover:border-blue-800" 
                      : 
                      "bg-gray3 border border-gray2 text-gray1 "
                    }`}
                    onClick={(e) => {
                    e.preventDefault();
                    if (validateOnSave() && props.clientSelect) {
                      props.handleAddClient(props.clientSelect);
                      props.setClientSelect(null);
                    }
                  }}
                  >
                    Confirmar
                  </button>
                  <button className="w-[94px] py-2 rounded-3xl bg-black border-black text-white hover:bg-gray-700 hover:border-gray-700 font-Lato font-bold transition duration-300 "
                  onClick={() => {props.setVisibleAdd(false)
                    props.setClientSelect(null)
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
                  <label htmlFor="identification_type" className="text-base text-black font-medium font-lato">Tipo de cédula</label>
                  <div className="relative">
                  <select
                    id="identification_type"
                    name="identification_type"
                    className="appearance-none w-[220px] py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                              focus:outline-2 focus:outline-blue-500"
                    value={props.clientSelect?.identification_type || ""}
                    onChange={(e) => {
                      props.handleChange(e);
                      if (errors.identification_type) {
                        setErrors((prev) => ({ ...prev, identification_type: "" }));
                      }
                    }}>
                    <option value="">Seleccione un tipo</option>
                    <option value="Cédula Física">Cédula Física</option>
                    <option value="Cédula Jurídica">Cédula Jurídica</option>
                    <option value="DIMEX">DIMEX</option>
                    <option value="NITE">NITE</option>
                    <option value="Extranjero no domiciliado">Extranjero No Domiciliado</option>
                    <option value="No contribuyente">No Contribuyente</option>
                  </select>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 fill-gray1">
                          <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clip-rule="evenodd" />
                      </svg>
                  </div>
                  {errors.identification_type && (
                    <span className="text-red-500 text-base font-lato">{errors.identification_type}</span>
                  )}
                  </div>

                  <div className="flex flex-col space-y-4">
                  <label htmlFor="id_number" className="text-base text-black font-medium font-lato">Cédula</label>
                  <input
                    className={`w-[220px] py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                      transition-colors
                      ${errors.id_number ? "border-red-500" : "border-gray2"}
                      focus:outline-2 focus:outline-blue-500`}
                    type="text"
                    id="id_number"
                    name="id_number"
                    value={props.clientSelect?.id_number || ""}
                    onChange={(e) => {
                      props.handleChange(e);
                      if (errors.id_number) {
                        setErrors((prev) => ({ ...prev, id_number: "" }));
                      }
                    }}
                    placeholder={
                    props.clientSelect?.identification_type === "Cédula Física"
                      ? "1-1234-5678"
                      : props.clientSelect?.identification_type === "Cédula Jurídica"
                      ? "3-101-234567"
                      : props.clientSelect?.identification_type === "DIMEX"
                      ? "1-234-567890"
                      : props.clientSelect?.identification_type === "Extranjero no domiciliado"
                      ? "4-000-123456"
                      : "Cédula"
                  }
                  />
                  {errors.id_number && (
                    <span className="text-red-500 text-base font-lato">{errors.id_number}</span>
                  )}
                  </div>

                  <div className="flex flex-col space-y-4">
                    <label htmlFor="telefono" className="font-lato text-base text-black font-medium">Teléfono</label>
                    <input className={`w-[220px] py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                    transition-colors ${errors.phone ? "border-red-500" : "border-gray2"} focus:outline-2 focus:outline-blue-500`}
                    type="string"
                    id="telefono"
                    name="phone"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    maxLength={8}
                    value={props.clientSelect?.phone || ""}
                    onChange={(e) => {
                    props.handleChange(e); 
                    if (errors.phone) {
                      setErrors((prev) => ({ ...prev, phone: "" })); 
                    }
                    }}
                      placeholder="0000-0000"
                    />
                    {errors.id_number && (
                    <span className="text-red-500 text-base font-lato">{errors.phone}</span>
                  )}
                  </div>
                </div>
                
                <div className="flex space-x-8">
                  <div className="flex flex-col space-y-4">
                  <label htmlFor="province_id" className="font-lato text-base text-black font-medium">Provincia</label>
                  <div className="relative">
                    <select className={`appearance-none w-[220px] py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                      transition-colors ${errors.province_id ? "border-red-500" : "border-gray2"}  disabled:bg-gray2 focus:outline-2 focus:outline-blue-500`}
                    id="province_id"
                    name="province_id"
                    value={props.clientSelect?.province_id || ""}
                    onChange={(e) => {
                        props.handleChange(e); 
                        if (errors.province_id) {
                          setErrors((prev) => ({ ...prev, province_id: "" })); 
                        }
                      }}>
                      <option value="">Seleccione</option>
                        {props.provinces.map((prov) => (
                        <option key={prov.id} value={prov.id}>
                          {prov.name}
                        </option>
                        ))}
                      </select>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 fill-gray1">
                        <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    {errors.province_id && (
                    <span className="text-red-500 text-base font-lato">{errors.province_id}</span>
                    )}
                  </div>

                  <div className="flex flex-col space-y-4">
                    <label htmlFor="nombre" className="font-lato text-base text-black font-medium">Nombre</label>
                    <input className={`w-[472px] py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                    transition-colors ${errors.name ? "border-red-500" : "border-gray2"} focus:outline-2 focus:outline-blue-500`}
                      type="text"
                      id="name"
                      name="name"
                      value={props.clientSelect?.name || ""}
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
                </div>
                  
                <div className="flex space-x-8">
                      <div className="flex flex-col space-y-4">
                        <label htmlFor="canton_id" className="font-lato text-base text-black font-medium">Cantón</label>
                        <div className="relative">
                        <select className={`appearance-none w-[220px] py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                        transition-colors ${errors.canton_id ? "border-red-500" : "border-gray2"}  disabled:bg-gray2 focus:outline-2 focus:outline-blue-500`}                                id="canton_id"
                                name="canton_id"
                                value={props.clientSelect?.canton_id || ""}
                                onChange={(e) => {
                                  props.handleChange(e); 
                                  if (errors.canton_id) {
                                    setErrors((prev) => ({ ...prev, canton_id: "" })); 
                                  }
                                }}
                              >
                              <option value="">Seleccione</option>
                              {props.cantons
                                .filter((c) => c.province_id === Number(props.clientSelect?.province_id))
                                .map((canton) => (
                                  <option key={canton.id} value={canton.id}>
                                    {canton.name}
                                  </option>
                                ))}
                          </select>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 fill-gray1">
                            <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clip-rule="evenodd" />
                          </svg>
                        </div>
                         {errors.canton_id && (
                            <span className="text-red-500 text-base font-lato">{errors.canton_id}</span>
                          )}
                      </div>

                  <div className="flex flex-col space-y-4">
                    <label htmlFor="apellidos" className="font-lato text-base text-black font-medium">Apellidos</label>
                    <input className={`w-[472px] py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                    transition-colors ${errors.last_name ? "border-red-500" : "border-gray2"} focus:outline-2 focus:outline-blue-500`}
                      type="text"
                      id="apellidos"
                      name="last_name"
                      value={props.clientSelect?.last_name || ""}
                      onChange={(e) => {
                      props.handleChange(e); 
                      if (errors.last_name) {
                        setErrors((prev) => ({ ...prev, last_name: "" })); 
                      }
                      }}
                      placeholder="Primer Apellido-Segundo Apellido"
                    />
                    {errors.name && (
                      <span className="text-red-500 text-base font-lato">{errors.last_name}</span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-8">
                  <div className="flex flex-col space-y-4">
                  <label htmlFor="district_id" className="font-lato text-base text-black font-medium">Distrito</label>
                  <div className="relative">
                  <select className={`appearance-none w-[220px] py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base transition-colors ${errors.district_id ? "border-red-500" : "border-gray2"}  disabled:bg-gray2 focus:outline-2 focus:outline-blue-500`}       
                    id="district_id"
                    name="district_id"
                    value={props.clientSelect?.district_id || ""}
                    onChange={(e) => {
                        props.handleChange(e); 
                        if (errors.district_id) {
                          setErrors((prev) => ({ ...prev, district_id: "" })); 
                        }
                      }}>
                    <option value="">Seleccione</option>
                    {props.districts.filter((d) => d.canton_id === Number(props.clientSelect?.canton_id))
                    .map((district) => (
                    <option key={district.id} value={district.id}>
                    {district.name}
                    </option>
                    ))}
                  </select>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 fill-gray1">
                      <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clip-rule="evenodd" />
                    </svg>
                  </div>
                    {errors.canton_id && (
                              <span className="text-red-500 text-base font-lato">{errors.district_id}</span>
                    )}
                  </div>

                  <div className="flex flex-col space-y-4">
                    <label htmlFor="correoElectronico" className="font-lato text-base text-black font-medium">Correo Eletrónico</label>
                    <input className={`w-[472px] py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                    transition-colors ${errors.email ? "border-red-500" : "border-gray2"} focus:outline-2 focus:outline-blue-500`}
                      type="text"
                      id="correoElectronico"
                      name="email"
                      value={props.clientSelect?.email || ""}
                      onChange={(e) => {
                      props.handleChange(e); 
                      if (errors.email) {
                        setErrors((prev) => ({ ...prev, email: "" })); 
                      }
                      }}
                      placeholder="example@gmail.com"
                    />
                    {errors.email && (
                      <span className="text-red-500 text-base font-lato">{errors.email}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <label htmlFor="direccion" className="font-lato text-base text-black font-medium">Dirección</label>
                  <textarea className={`pt-1 w-[724px] min-h-30 max-h-40 border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                  transition-colors ${errors.address ? "border-red-500" : "border-gray2"} focus:outline-2 focus:outline-blue-500`}
                    id="direccion"
                    name="address"
                    value={props.clientSelect?.address || ""}
                    onChange={(e) => {
                    props.handleChange(e); 
                    if (errors.address) {
                      setErrors((prev) => ({ ...prev, address: "" })); 
                    }
                    }}
                    placeholder="Dirección del cliente o empresa"
                  />
                  {errors.address && (
                    <span className="text-red-500 text-base font-lato">{errors.address}</span>
                  )}
                </div>
              </form>
            </div>
          </div>

    );

}