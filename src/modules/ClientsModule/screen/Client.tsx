import { Navbar } from "../components/navbar"
import { Sidebar } from "../../../components/Sidebar";
import { useState } from "react";

const clientsItems = [
  { id: 1, name: 'Moises David Morales Chin', cedula: '604850878', facturas: 5, provincia: 1, phone: '8888-1111', tipoCliente: 1 },
  { id: 2, name: 'Joshua Herrera Salazar', cedula: '104850878', facturas: 2, provincia: 2, phone: '8888-2222', tipoCliente: 1 },
  { id: 3, name: 'Francisco Sequeira Mendoza', cedula: '504850878', facturas: 7, provincia: 3, phone: '8888-3333', tipoCliente: 1 },
  { id: 4, name: 'Marco Alfonso De La Cruz', cedula: '204850878', facturas: 3, provincia: 4, phone: '8888-4444', tipoCliente: 1 },
  { id: 5, name: 'Jose Zamora Marioneta Rivas', cedula: '304850878', facturas: 4, provincia: 5, phone: '8888-5555', tipoCliente: 1 },
  { id: 6, name: 'Daniela Rodríguez Castro', cedula: '654850878', facturas: 6, provincia: 6, phone: '8888-6666', tipoCliente: 1 },
  { id: 7, name: 'Adrián López Villalobos', cedula: '754850878', facturas: 1, provincia: 7, phone: '8888-7777', tipoCliente: 1 },
  { id: 8, name: 'Gabriela Sánchez Porras', cedula: '854850878', facturas: 8, provincia: 1, phone: '8888-8888', tipoCliente: 1 },
  { id: 9, name: 'Esteban Vargas Quesada', cedula: '954850878', facturas: 2, provincia: 2, phone: '8888-9999', tipoCliente: 1 },
  { id: 10, name: 'Sofía Jiménez Araya', cedula: '114850878', facturas: 5, provincia: 3, phone: '8999-1111', tipoCliente: 1 },
  { id: 11, name: 'Andrés Mora Solano', cedula: '124850878', facturas: 3, provincia: 4, phone: '8999-2222', tipoCliente: 1 },
  { id: 12, name: 'Carolina Pérez Montero', cedula: '134850878', facturas: 4, provincia: 5, phone: '8999-3333', tipoCliente: 1 },
  { id: 13, name: 'Ricardo Chaves González', cedula: '144850878', facturas: 6, provincia: 6, phone: '8999-4444', tipoCliente: 1 },
  { id: 14, name: 'Paola Fernández Ureña', cedula: '154850878', facturas: 7, provincia: 7, phone: '8999-5555', tipoCliente: 1 },
  { id: 15, name: 'Supermercado La Estrella S.A.', cedula: '3101501234', facturas: 12, provincia: 1, phone: '2222-1111', tipoCliente: 2 },
  { id: 16, name: 'Transportes Rápidos Tico S.R.L.', cedula: '3102205678', facturas: 9, provincia: 4, phone: '2222-2222', tipoCliente: 2 },
  { id: 17, name: 'Construcciones del Valle Ltda.', cedula: '3103309876', facturas: 15, provincia: 5, phone: '2222-3333', tipoCliente: 2 },
  { id: 18, name: 'Farmacia Vida Nueva S.A.', cedula: '3104406543', facturas: 6, provincia: 2, phone: '2222-4444', tipoCliente: 2 },
  { id: 19, name: 'Tecnologías Avanzadas CR S.A.', cedula: '3105504321', facturas: 11, provincia: 7, phone: '2222-5555', tipoCliente: 2 }
];
export const Client = () => {

  const [clientSelect, setClientSelect] = useState<any>(null);
  const [clients, setClients] = useState(clientsItems);
  const [edit, setEdit] = useState(false)
  const [activePage, setActivePage] = useState<number>(1);


  const handleSave = () => {
    if (!clientSelect) return;

    setClients(prevClients =>
      prevClients.map(c =>
        c.id === clientSelect.id ? clientSelect : c
      )
    );
    setEdit(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClientSelect((prev: any) => ({
      ...prev,
      [name]: value,
    }));
    setEdit(true);
  };

  return (
    <div className="flex absolute flex-col size-full ">

      <div>
        <Navbar></Navbar>
      </div>

      <div className="bg-red-500 size-full flex flex-col">

        <div className="flex">
          <Sidebar></Sidebar>
          <div className="w-96 bg-gray3 ">

            <div className="pl-8 mt-8 flex  justify-between">
              <h2 className="font-Lato text-2xl">Lista de Clientes</h2>
              <button className="w-[94px] bg-blue-500 rounded-3xl py-2 font-Lato text-white text-base">Añadir</button>
            </div>

            <div className="w-full h-auto pl-8">
              <h3 className="font-Lato font-medium text-base text-gray1">Todos los clientes registrados <br />en sistema</h3>
            </div>

            <div className="w-full h-[602px] flex flex-col overflow-y-auto mt-11">
              <div className="space-y-2">
                {clients.map((items) => (
                  <div className="w-full pl-8 pr-18 flex">
                    <div className={`w-full h-auto  rounded-xl pb-4 font-lato text-black text-base shadow ${clientSelect === items ? "bg-blue-500 text-white" : "bg-white"}`}
                      onClick={() => setClientSelect(items)}>
                      <h2 className="w-full h-auto ml-4 mt-4 font-medium">{items.name}</h2>
                      <h3 className="mt-1 ml-4">{items.cedula}</h3>
                      <h4 className="mt-5 justify-end w-full flex pr-4">Facturas: {items.facturas}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

              <div className="flex w-full pl-8 pt-6 pr-19 justify-between font-Lato font-medium">
                {[1, 2, 3, "...", 8].map((num, index) => (
                  <button
                    key={index}
                    className={`size-[42px] border rounded-full active:outline-0 
                      ${activePage === num 
                        ? "bg-blue-500 text-white" 
                        : "bg-white border-gray2 text-gray1"}`}
                    onClick={() => typeof num === "number" && setActivePage(num)}
                  >
                    {num}
                  </button>
                ))}
            </div>

          </div>

          <div className="flex-1 flex-col">
            <div className="bg-gray3 w-full h-min flex flex-col">
              <div className="flex w-full justify-between pt-8">
                <h2 className="pl-8 font-Lato text-2xl ">Datos del Cliente</h2>
                <div className="flex space-x-8 pr-4">
                  <button className={`w-[94px] py-2 rounded-3xl font-Lato font-bold ${edit ? "bg-blue-500 text-white" : "bg-white border border-gray2 text-gray1"}`}
                    onClick={handleSave}>
                    Editar
                  </button>
                  <button className="w-[94px] py-2 rounded-3xl bg-white border border-gray2 text-gray1 font-Lato font-bold">Eliminar</button>
                </div>
              </div>

              <div className="w-full flex pt-8 pl-8 pb-4 font-Lato text-base space-x-8">
                <button className="w-[220px] text-center font-medium">Información General</button>
                <button className="w-[94px] text-center font-medium">Facturas</button>
                <button className="w-[94px] text-center font-medium">Historial</button>
              </div>
              <div className="w-full h-1 bg-graybar"></div>

            </div>

            <div className="w-auto bg-[#DEE8ED] h-screen">
              <form className="flex-col flex font-Lato pt-8 pl-8 space-y-4">
                <div className="flex space-x-8">
                  <div className="flex flex-col space-y-4">
                    <label htmlFor="cedula" className="text-base text-black font-medium">Cédula</label>
                    <input className="w-[220px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                             focus:outline-blue-500 focus:outline-2"
                      type="text"
                      id="cedula"
                      name="cedula"
                      value={clientSelect?.cedula || ""}
                      onChange={handleChange}
                      placeholder="0-0000-0000"
                    />
                  </div>

                  <div className="flex flex-col space-y-4">
                    <label htmlFor="tipoCliente">Tipo de Cliente</label>
                    <select id="tipoCliente" name="tipoCliente" className="w-[220px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2
                             bg-white font-medium text-base appearance-none focus:outline-blue-500 focus:outline-2"
                      value={clientSelect?.tipoCliente || ""}
                      onChange={handleChange}
                    >
                      <option value="0"> Seleccionar Tipo</option>
                      <option value="1">Individual</option>
                      <option value="2">Empresa</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <label htmlFor="name" className="text-base text-black font-medium">Nombre Completo</label>
                  <input className="w-[472px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                          focus:outline-blue-500 focus:outline-2"
                    type="text"
                    id="name"
                    name="name"
                    value={clientSelect?.name || ""}
                    onChange={handleChange}
                    placeholder="name-Apellido-Apellido..."
                  />
                </div>

                <div className="flex flex-col space-y-4">
                  <label htmlFor="phone">Teléfono</label>
                  <input className="w-[472px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                          focus:outline-blue-500 focus:outline-2"
                    type="text"
                    id="phone"
                    name="phone"
                    value={clientSelect?.phone || ""}
                    onChange={handleChange}
                    placeholder="0000-0000"
                  />
                </div>


                <div className="flex flex-col space-y-4">
                  <label htmlFor="provincia">Provincia</label>
                  <select id="provincia" name="provincia" className="w-[472px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2
                           bg-white font-medium text-base appearance-none focus:outline-blue-500 focus:outline-2"
                    value={clientSelect?.provincia || ""}
                    onChange={handleChange}
                  >
                    <option value="0">Seleccionar Provincia</option>
                    <option value="1">San José</option>
                    <option value="2">Alajuela</option>
                    <option value="3">Cartago</option>
                    <option value="4">Heredia</option>
                    <option value="5">Guanacaste</option>
                    <option value="6">Puntarenas</option>
                    <option value="7">Limón</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-4">
                  <label htmlFor="direccion">Dirección</label>
                  <textarea className="w-[472px] min-h-[96px] max-h-[132px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
                          focus:outline-blue-500 focus:outline-2 pt-2"
                    id="direccion"
                    name="direccion"
                    placeholder="Dirección del cliente o empresa"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};
