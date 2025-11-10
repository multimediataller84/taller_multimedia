import { useState } from "react";
import { TProvince } from "../models/types/TProvince";
import { TCanton } from "../models/types/TCanton";
import { TDistrict } from "../models/types/TDistrict";
import ConfirmDialog from "../../Credit/components/ConfirmDialog";

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
    const [confirmDialog, setConfirmDialog] = useState({
      open: false,
      payload: null as any,
    });
  
    const validateOnSave = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    const type = props.clientSelect?.identification_type;
    const id = props.clientSelect?.id_number?.trim();

    if (!type) newErrors.identification_type = "Seleccione un tipo de cédula";

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
      newErrors.phone = "Formato de teléfono incorrecto";
    }

    if (!props.clientSelect?.email) {
      newErrors.email = "El correo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(props.clientSelect.email)) {
      newErrors.email = "Correo inválido";
    }

    if (!props.clientSelect?.name) newErrors.name = "El nombre es obligatorio";
    if (!props.clientSelect?.last_name)
      newErrors.last_name = "Los apellidos son obligatorios";
    if (!props.clientSelect?.address)
      newErrors.address = "La dirección es obligatoria";
    if (!props.clientSelect?.province_id)
      newErrors.province_id = "La provincia es obligatoria";
    if (!props.clientSelect?.canton_id)
      newErrors.canton_id = "El cantón es obligatorio";
    if (!props.clientSelect?.district_id)
      newErrors.district_id = "El distrito es obligatorio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    return (
        <div className="flex flex-col w-full bg-gray3">
            <div className="w-full flex flex-col">
              <div className="flex w-full justify-between items-center pt-2 md:pt-4 2xl:pt-8">
                <h2 className="font-Lato text-sm md:text-base xl:text-base 2xl:text-2xl pl-8">Añadir Cliente</h2>
                <div className="flex space-x-2 md:space-x-4 2xl:space-x-8 pr-4">
                   
                  <button
                    className={`py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato font-bold transition duration-300 ${
                      props.add
                        ? "bg-blue-500 text-white border border-blue-500 hover:bg-blue-800 hover:border-blue-800"
                        : "bg-gray3 border border-gray2 text-gray1"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (validateOnSave() && props.clientSelect) {
                        setConfirmDialog({
                          open: true,
                          payload: props.clientSelect,
                        });
                      }
                    }}
                  >
                    Confirmar
                  </button>
                  <button className="py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato font-bold bg-black border-black text-white hover:bg-gray-700 hover:border-gray-700 transition duration-300"
                  onClick={() => {props.setVisibleAdd(false)
                    props.setClientSelect(null)
                  }
                  }
                  >Cancelar</button>
                </div>

                <ConfirmDialog
                open={confirmDialog.open}
                onCancel={() => setConfirmDialog({ open: false, payload: null })}
                onConfirm={() => {
                  if (confirmDialog.payload) {
                    props.handleAddClient(confirmDialog.payload);
                    props.setClientSelect(null);
                  }
                  setConfirmDialog({ open: false, payload: null });
                }}
                title="¿Agregar cliente?"
                message="¿Seguro que deseas agregar este nuevo cliente?"
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
                  {/* Tipo de cédula */}
                  <div className="flex flex-col space-y-2 flex-1 min-w-[220px]">
                    <label htmlFor="identification_type" className="text-sm sm:text-base text-black font-medium">Tipo de cédula</label>
                    <div className="relative">
                      <select
                        id="identification_type"
                        name="identification_type"
                        className="appearance-none w-full py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white text-sm sm:text-base focus:outline-2 focus:outline-blue-500"
                        value={props.clientSelect?.identification_type || ""}
                        onChange={(e) => {
                          props.handleChange(e);
                          if (errors.identification_type) {
                            setErrors((prev) => ({ ...prev, identification_type: "" }));
                          }
                        }}
                      >
                        <option value="">Seleccione un tipo</option>
                        <option value="Cédula Física">Cédula Física</option>
                        <option value="Cédula Jurídica">Cédula Jurídica</option>
                        <option value="DIMEX">DIMEX</option>
                        <option value="NITE">NITE</option>
                        <option value="Extranjero no domiciliado">Extranjero No Domiciliado</option>
                        <option value="No contribuyente">No Contribuyente</option>
                      </select>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                        className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 fill-gray1">
                        <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    {errors.identification_type && (
                      <span className="text-red-500 text-sm">{errors.identification_type}</span>
                    )}
                  </div>

                  {/* Cédula */}
                  <div className="flex flex-col space-y-2 flex-1 min-w-[220px]">
                    <label htmlFor="cedula" className="text-sm sm:text-base text-black font-medium">Cédula</label>
                    <input
                      className={`w-full py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white text-sm sm:text-base
                        ${errors.id_number ? "border-red-500" : "border-gray2"} focus:outline-2 focus:outline-blue-500`}
                      type="text"
                      id="cedula"
                      name="id_number"
                      value={props.clientSelect?.id_number || ""}
                      onChange={(e) => {
                        props.handleChange(e);
                        if (errors.id_number) setErrors((prev) => ({ ...prev, id_number: "" }));
                      }}
                      placeholder="0-0000-0000"
                      maxLength={9}
                    />
                    {errors.id_number && (
                      <span className="text-red-500 text-sm">{errors.id_number}</span>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="flex flex-col space-y-2 flex-1 min-w-[220px]">
                    <label htmlFor="telefono" className="text-sm sm:text-base text-black font-medium">Teléfono</label>
                    <input
                      className={`w-full py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white text-sm sm:text-base
                        ${errors.phone ? "border-red-500" : "border-gray2"} focus:outline-2 focus:outline-blue-500`}
                      type="text"
                      id="telefono"
                      name="phone"
                      value={props.clientSelect?.phone || ""}
                      onChange={(e) => {
                        props.handleChange(e);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                      }}
                      placeholder="0000-0000"
                      maxLength={8}
                    />
                    {errors.phone && (
                      <span className="text-red-500 text-sm">{errors.phone}</span>
                    )}
                  </div>
                </div>

        
                <div className="flex flex-wrap gap-2 2xl:gap-6">
                  {/* Provincia */}
                  <div className="flex flex-col space-y-2 flex-1 min-w-[220px]">
                    <label htmlFor="province_id" className="text-sm sm:text-base text-black font-medium">Provincia</label>
                    <div className="relative">
                      <select
                        id="province_id"
                        name="province_id"
                        className={`appearance-none w-full py-2 border rounded-3xl px-4 text-gray1 bg-white text-sm sm:text-base
                          ${errors.province_id ? "border-red-500" : "border-gray2"} focus:outline-2 focus:outline-blue-500`}
                        value={props.clientSelect?.province_id || ""}
                        onChange={(e) => {
                          props.handleChange(e);
                          if (errors.province_id) setErrors((prev) => ({ ...prev, province_id: "" }));
                        }}
                      >
                        <option value="">Seleccione</option>
                        {props.provinces.map((prov) => (
                          <option key={prov.id} value={prov.id}>{prov.name}</option>
                        ))}
                      </select>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                        className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 fill-gray1">
                        <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    {errors.province_id && (
                      <span className="text-red-500 text-sm">{errors.province_id}</span>
                    )}
                  </div>

                  {/* Nombre */}
                  <div className="flex flex-col space-y-2 flex-1 min-w-[220px]">
                    <label htmlFor="nombre" className="text-sm sm:text-base text-black font-medium">Nombre</label>
                    <input
                      className={`w-full py-2 border rounded-3xl px-4 text-gray1 bg-white text-sm sm:text-base
                        ${errors.name ? "border-red-500" : "border-gray2"} focus:outline-2 focus:outline-blue-500`}
                      type="text"
                      id="name"
                      name="name"
                      value={props.clientSelect?.name || ""}
                      onChange={(e) => {
                        props.handleChange(e);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                      }}
                      placeholder="Nombre"
                    />
                    {errors.name && (
                      <span className="text-red-500 text-sm">{errors.name}</span>
                    )}
                  </div>
                </div>

              
                <div className="flex flex-wrap gap-2 2xl:gap-6">
                  {/* Cantón */}
                  <div className="flex flex-col space-y-2 flex-1 min-w-[220px]">
                    <label htmlFor="canton_id" className="text-sm sm:text-base text-black font-medium">Cantón</label>
                    <div className="relative">
                      <select
                        id="canton_id"
                        name="canton_id"
                        className={`appearance-none w-full py-2 border rounded-3xl px-4 text-gray1 bg-white text-sm sm:text-base
                          ${errors.canton_id ? "border-red-500" : "border-gray2"} focus:outline-2 focus:outline-blue-500`}
                        value={props.clientSelect?.canton_id || ""}
                        onChange={(e) => {
                          props.handleChange(e);
                          if (errors.canton_id) setErrors((prev) => ({ ...prev, canton_id: "" }));
                        }}
                      >
                        <option value="">Seleccione</option>
                        {props.cantons
                          .filter((c) => c.province_id === Number(props.clientSelect?.province_id))
                          .map((canton) => (
                            <option key={canton.id} value={canton.id}>{canton.name}</option>
                          ))}
                      </select>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                        className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 fill-gray1">
                        <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    {errors.canton_id && (
                      <span className="text-red-500 text-sm">{errors.canton_id}</span>
                    )}
                  </div>

                  {/* Apellidos */}
                  <div className="flex flex-col space-y-2 flex-1 min-w-[220px]">
                    <label htmlFor="apellidos" className="text-sm sm:text-base text-black font-medium">Apellidos</label>
                    <input
                      className={`w-full py-2 border rounded-3xl px-4 text-gray1 bg-white text-sm sm:text-base
                        ${errors.last_name ? "border-red-500" : "border-gray2"} focus:outline-2 focus:outline-blue-500`}
                      type="text"
                      id="apellidos"
                      name="last_name"
                      value={props.clientSelect?.last_name || ""}
                      onChange={(e) => {
                        props.handleChange(e);
                        if (errors.last_name) setErrors((prev) => ({ ...prev, last_name: "" }));
                      }}
                      placeholder="Primer Apellido - Segundo Apellido"
                    />
                    {errors.last_name && (
                      <span className="text-red-500 text-sm">{errors.last_name}</span>
                    )}
                  </div>
                </div>

        
                <div className="flex flex-wrap gap-2 2xl:gap-6">
                  {/* Distrito */}
                  <div className="flex flex-col space-y-2 flex-1 min-w-[220px]">
                    <label htmlFor="district_id" className="text-sm sm:text-base text-black font-medium">Distrito</label>
                    <div className="relative">
                      <select
                        id="district_id"
                        name="district_id"
                        className={`appearance-none w-full py-2 border rounded-3xl px-4 text-gray1 bg-white text-sm sm:text-base
                          ${errors.district_id ? "border-red-500" : "border-gray2"} focus:outline-2 focus:outline-blue-500`}
                        value={props.clientSelect?.district_id || ""}
                        onChange={(e) => {
                          props.handleChange(e);
                          if (errors.district_id) setErrors((prev) => ({ ...prev, district_id: "" }));
                        }}
                      >
                        <option value="">Seleccione</option>
                        {props.districts
                          .filter((d) => d.canton_id === Number(props.clientSelect?.canton_id))
                          .map((district) => (
                            <option key={district.id} value={district.id}>{district.name}</option>
                          ))}
                      </select>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                        className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 fill-gray1">
                        <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    {errors.district_id && (
                      <span className="text-red-500 text-sm">{errors.district_id}</span>
                    )}
                  </div>

                  {/* Correo */}
                  <div className="flex flex-col space-y-2 flex-1 min-w-[220px]">
                    <label htmlFor="correoElectronico" className="text-sm sm:text-base text-black font-medium">Correo Electrónico</label>
                    <input
                      className={`w-full py-2 border rounded-3xl px-4 text-gray1 bg-white text-sm sm:text-base
                        ${errors.email ? "border-red-500" : "border-gray2"} focus:outline-2 focus:outline-blue-500`}
                      type="email"
                      id="correoElectronico"
                      name="email"
                      value={props.clientSelect?.email || ""}
                      onChange={(e) => {
                        props.handleChange(e);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      placeholder="example@gmail.com"
                    />
                    {errors.email && (
                      <span className="text-red-500 text-sm">{errors.email}</span>
                    )}
                  </div>
                </div>

                {/* Dirección */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="direccion" className="text-sm sm:text-base text-black font-medium">Dirección</label>
                  <textarea
                    className={`pt-1 w-full min-h-15 max-h-20 2xl:min-h-28 2xl:max-h-40 border rounded-3xl px-4 text-gray1 bg-white text-sm sm:text-base
                      ${errors.address ? "border-red-500" : "border-gray2"} focus:outline-2 focus:outline-blue-500`}
                    id="direccion"
                    name="address"
                    value={props.clientSelect?.address || ""}
                    onChange={(e) => {
                      props.handleChange(e);
                      if (errors.address) setErrors((prev) => ({ ...prev, address: "" }));
                    }}
                    placeholder="Dirección del cliente o empresa"
                  />
                  {errors.address && (
                    <span className="text-red-500 text-sm">{errors.address}</span>
                  )}
                </div>
              </form>
            </div>
          </div>

    );

}