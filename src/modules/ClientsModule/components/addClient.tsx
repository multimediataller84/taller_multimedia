interface addClientProps{
    visibleAdd: boolean;
    setVisibleAdd: React.Dispatch<React.SetStateAction<boolean>>;  
    clientSelect: any;
    setClientSelect: React.Dispatch<React.SetStateAction<any>>;
    add: boolean; 
    handleAddClient: (newClient: any) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}


export default function addClient (props: addClientProps){

    return (
        <div className="flex-1 flex-col">
            <div className="bg-gray3 w-full h-min flex flex-col">
              <div className="flex w-full justify-between pt-8">
                <h2 className="pl-8 font-Lato text-2xl ">Añadir Cliente</h2>
                <div className="flex space-x-8 pr-4">
                  <button
                    className={`w-[94px] py-2 rounded-3xl font-Lato font-bold transition duration-300  ${
                      props.add ? "bg-blue-500 text-white hover:bg-blue-800 hover:border-blue-800" 
                      : 
                      "bg-white border border-gray2 text-gray1 hover:bg-gray2 hover:border-gray2"
                    }`}
                    onClick={() => {
                      if (props.clientSelect) {
                        props.handleAddClient(props.clientSelect);
                        props.setClientSelect(null); 
                      }
                    }}
                  >
                    Confirmar
                  </button>
                  <button className="w-[94px] py-2 rounded-3xl bg-white border border-gray2 hover:bg-gray2 hover:border-gray2 text-gray1 font-Lato font-bold transition duration-300 "
                  onClick={() => {props.setVisibleAdd(false)
                    props.setClientSelect(null)
                  }
                  }
                  >Cancelar</button>
                </div>
              </div>

              <div className="w-full flex pt-8 pl-8 pb-4 font-Lato text-base space-x-8">
                <button className="w-[220px] text-center font-medium">Información General</button>
                <button className="w-[94px] text-center font-medium">Facturas</button>
                <button className="w-[94px] text-center font-medium">Historial</button>
              </div>
              <div className="w-full h-1 bg-graybar"></div>
            </div>


             <div className="w-auto bg-[#DEE8ED] h-min">
              <form className="flex-col flex font-Lato pt-8 pl-8 space-y-4">
                <div className="flex space-x-8">
                  <div className="flex flex-col space-y-4">
                    <label htmlFor="cedula" className="text-base text-black font-medium">Cédula</label>
                    <input className="w-[220px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
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
                    <input className="w-[220px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
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
                  <input className="w-[472px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
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
                  <input className="w-[472px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
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
                  <input className="w-[472px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
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
                  <textarea className="w-[472px] min-h-[96px] max-h-[132px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                          focus:outline-blue-500 focus:outline-2 pt-2"
                    id="direccion"
                    name="address"
                    value={props.clientSelect?.address || ""}
                      onChange={props.handleChange}
                    placeholder="Dirección del cliente o empresa"
                  />
                </div>
              </form>
            </div>
          </div>

    );

}