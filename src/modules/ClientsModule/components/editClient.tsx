import { TCustomerEndpoint } from "../models/types/TCustomerEndpoint";
import { useState } from "react";
import Credit from "../../Credit/screen/Credit";

interface editClientProps {
  clientSelect: TCustomerEndpoint | null; 
  edit: boolean;
  handleSave: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleDelete: (id: number) => void;
}

export default function editClient(props: editClientProps) {

  const [moveBar, setmMoveBar] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateOnSave = () => {
    const newErrors: { [key: string]: string } = {};

    if (!props.clientSelect?.id_number) {
      newErrors.id_number = "La cédula es obligatoria";
    } else if (!/^\d{1}\d{4}\d{4}$/.test(props.clientSelect.id_number)) {
      newErrors.id_number = "Formato de cédula incorrecto";
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
      newErrors.first_name = "El nombre es obligatorio";
    }

    if (!props.clientSelect?.last_name) {
      newErrors.last_name = "Los apellidos son obligatorios";
    }

    if (!props.clientSelect?.address) {
      newErrors.address = "La dirección es obligatoria";
    }


    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      props.handleSave();
    }
  };

  return (
    <div className="w-[70%] flex flex-col ">
      <div className="bg-gray3 w-full flex flex-col">
        <div className="flex w-full justify-between pt-8">
          <h2 className="pl-8 font-Lato text-2xl ">Datos del Cliente</h2>
          <div className="flex space-x-8 pr-4">
            <button
              className={`w-[94px] py-2 rounded-3xl font-Lato font-bold transition duration-300 
                ${props.edit ? "bg-blue-500 text-white hover:bg-blue-800 hover:border-blue-800" 
                : "bg-white border border-gray2 text-gray1 hover:bg-gray2 hover:border-gray2"}`}
              onClick={validateOnSave}
            >
              Editar
            </button>
            <button
              className="w-[94px] py-2 rounded-3xl bg-[#FF4747] border border-[#FF4747] hover:bg-[#D32626] text-white font-Lato font-bold transition duration-300 "
              onClick={() => props.clientSelect && props.handleDelete(props.clientSelect.id)}
            >
              Eliminar
            </button>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <div className="flex w-full mt-8 space-y-4 font-lato font-medium">
            <h2
              className={`w-1/3 text-center ${moveBar === 0 ? "text-blue-500" : "text-gray1"}`}
              onClick={() => setmMoveBar(0)}
            >
              Información General
            </h2>
            <h3
              className={`w-1/3 text-center ${moveBar === 1 ? "text-blue-500" : "text-gray1"}`}
              onClick={() => setmMoveBar(1)}
            >
              Facturas
            </h3>
            <h4
              className={`w-1/3 text-center ${moveBar === 2 ? "text-blue-500" : "text-gray1"}`}
              onClick={() => setmMoveBar(2)}
            >
              Créditos
            </h4>
          </div>
          <div className="w-full h-1 bg-graybar relative">
            <div
              className={`h-1 w-1/3 bg-blue-500 transition-transform duration-150 ease-in-out
                ${moveBar === 0 ? "translate-x-0" : ""} 
                ${moveBar === 1 ? "translate-x-full" : ""} 
                ${moveBar === 2 ? "translate-x-[200%]" : ""}`}
            />
          </div>
        </div>
      </div>

      <div className="w-auto bg-[#DEE8ED] size-full">
        {moveBar === 0 && (
          <form className="flex-col flex font-Lato pt-8 pl-8 space-y-4">
            <div className="flex space-x-8">
              <div className="flex flex-col space-y-4">
                <label htmlFor="cedula" className="text-base text-black font-medium">
                    Cédula
                  </label>
                  <input
                  className={`w-[220px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                    transition-colors
                    ${errors.id_number ? "border-red-500" : "border-gray2"}
                    focus:outline-2 focus:outline-blue-500`}
                  type="text"
                  id="cedula"
                  name="id_number"
                  value={props.clientSelect?.id_number || ""}
                  onChange={(e) => {
                    props.handleChange(e); 
                    if (errors.id_number) {
                      setErrors((prev) => ({ ...prev, id_number: "" })); 
                    }
                  }}
                  placeholder="0-0000-0000"
                  maxLength={9}
                />
                {errors.id_number && (
                  <span className="text-red-500 text-base font-lato">{errors.id_number}</span>
                )}
              </div>

              <div className="flex flex-col space-y-4">
                <label htmlFor="telefono">Teléfono</label>
                  <input
                    className={`w-[220px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                    transition-colors ${errors.phone ? "border-red-500" : "border-gray2"} focus:outline-2 focus:outline-blue-500`}
                    type="string"
                    id="telefono"
                    name="phone"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    value={props.clientSelect?.phone || ""}
                    onChange={(e) => {
                    props.handleChange(e); 
                    if (errors.phone) {
                      setErrors((prev) => ({ ...prev, phone: "" })); 
                    }
                    }}
                    placeholder="0000-0000"
                    maxLength={8}
                  />
                  {errors.phone && (
                    <span className="text-red-500 text-sm">{errors.phone}</span>
                  )}
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <label htmlFor="nombre" className="text-base text-black font-medium">Nombre</label>
              <input
                className="w-[472px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                focus:outline-blue-500 focus:outline-2"
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

            <div className="flex flex-col space-y-4">
              <label htmlFor="apellidos">Apellidos</label>
              <input
                className={`w-[472px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
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
              {errors.last_name && (
                <span className="text-red-500 text-base font-lato">{errors.last_name}</span>
              )}
            </div>

            <div className="flex flex-col space-y-4">
               <label htmlFor="correoElectronico">Correo Electrónico</label>
                <input
                  className={`w-[472px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                  transition-colors ${errors.email ? "border-red-500" : "border-gray2"} focus:outline-2 focus:outline-blue-500`}
                  type="email"
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
                  <span className="text-red-500 text-sm">{errors.email}</span>
                )}
            </div>

            <div className="flex flex-col space-y-4">
              <label htmlFor="direccion">Dirección</label>
              <textarea
                className={`pt-1 w-[472px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                transition-colors ${errors.address ? "border-red-500" : "border-gray2"} focus:outline-2 focus:outline-blue-500`}
                id="direccion"
                name="address"
                value={props.clientSelect?.address}
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
        )}

        {/*Facturas*/}
        {moveBar === 1 && (
          <div className="p-8 font-Lato">
            {/*Aquí se agregan facturas, digo yo*/}
            Sección de Facturas (pendiente de implementar)
          </div>
        )}

        {/*Créditos*/}
        {moveBar === 2 && props.clientSelect?.id && (
          <Credit
            clientId={props.clientSelect.id}
            clientName={`${props.clientSelect.name} ${props.clientSelect.last_name}`}
            key={props.clientSelect.id}   // fuerza remount limpio al cambiar de cliente
          />
        )}
      </div>
    </div>
  );
}