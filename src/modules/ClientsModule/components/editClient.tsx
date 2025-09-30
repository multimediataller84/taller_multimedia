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

  return (
    <div className="w-[65%] flex flex-col ">
      <div className="bg-gray3 w-full flex flex-col">
        <div className="flex w-full justify-between pt-8">
          <h2 className="pl-8 font-Lato text-2xl ">Datos del Cliente</h2>
          <div className="flex space-x-8 pr-4">
            <button
              className={`w-[94px] py-2 rounded-3xl font-Lato font-bold transition duration-300 
                ${props.edit ? "bg-blue-500 text-white hover:bg-blue-800 hover:border-blue-800" 
                : "bg-white border border-gray2 text-gray1 hover:bg-gray2 hover:border-gray2"}`}
              onClick={props.handleSave}
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
        {/* TAB 0: Información General */}
        {moveBar === 0 && (
          <form className="flex-col flex font-Lato pt-8 pl-8 space-y-4">
            <div className="flex space-x-8">
              <div className="flex flex-col space-y-4">
                <label htmlFor="cedula" className="text-base text-black font-medium">Cédula</label>
                <input
                  className="w-[220px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                    focus:outline-blue-500 focus:outline-2"
                  type="text"
                  id="cedula"
                  name="id_number"
                  value={props.clientSelect?.id_number || ""}
                  onChange={props.handleChange}
                  placeholder="0-0000-0000"
                />
              </div>

              <div className="flex flex-col space-y-4">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  className="w-[220px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                    focus:outline-blue-500 focus:outline-2"
                  type="text"
                  id="telefono"
                  name="phone"
                  value={props.clientSelect?.phone || ""}
                  onChange={props.handleChange}
                  placeholder="0000-0000"
                />
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
                onChange={props.handleChange}
                placeholder="Nombre"
              />
            </div>

            <div className="flex flex-col space-y-4">
              <label htmlFor="apellidos">Apellidos</label>
              <input
                className="w-[472px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                          focus:outline-blue-500 focus:outline-2"
                type="text"
                id="apellidos"
                name="last_name"
                value={props.clientSelect?.last_name || ""}
                onChange={props.handleChange}
                placeholder="Primer Apellido-Segundo Apellido"
              />
            </div>

            <div className="flex flex-col space-y-4">
              <label htmlFor="correoElectronico">Correo Eletrónico</label>
              <input
                className="w-[472px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                          focus:outline-blue-500 focus:outline-2"
                type="text"
                id="correoElectronico"
                name="email"
                value={props.clientSelect?.email || ""}
                onChange={props.handleChange}
                placeholder="example@gmail.com"
              />
            </div>

            <div className="flex flex-col space-y-4">
              <label htmlFor="direccion">Dirección</label>
              <textarea
                className="w-[472px] min-h-[96px] max-h-[132px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                          focus:outline-blue-500 focus:outline-2 pt-2"
                id="direccion"
                name="address"
                value={props.clientSelect?.address}
                onChange={props.handleChange}
                placeholder="Dirección del cliente o empresa"
              />
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
        {moveBar === 2 && (
          <Credit client={props.clientSelect} />
        )}
      </div>
    </div>
  );
}
