import { Navbar } from "../../../components/navbar"
import { Sidebar } from "../../../components/Sidebar";
import EditClient from '../components/editClient'
import AddClient from "../components/addClient";

import { useEffect, useState } from "react";
import { CustomerService } from "../services/customerService"; 
import { TCustomerEndpoint } from "../models/types/TCustomerEndpoint";

const customerService = CustomerService.getInstance();

export const Client = () => {

  const [clients, setClients] = useState<TCustomerEndpoint[]>([]);
  const [clientSelect, setClientSelect] = useState<any>(null);

  const [edit, setEdit] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false); 

  const [add, setAdd] = useState(false); 
  const [visibleAdd, setVisibleAdd] = useState(false);

  const [search, setSearch] = useState("");
  const [activePage, setActivePage] = useState(1);
  const clientsPerPage = 10; 
  const filteredClients = clients.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.last_name.toLowerCase().includes(q) ||
      c.id_number.toLowerCase().includes(q)
    );
  });
  const totalPages = Math.max(1, Math.ceil(filteredClients.length / clientsPerPage));
  const safePage = Math.min(activePage, totalPages);
  const indexOfLastClient = safePage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await customerService.getAll();
        setClients(data);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    setActivePage(1);
  }, [search]);

  const handleSave = async () => {
  if (!clientSelect) return;
  try {
    const updated = await customerService.patch(clientSelect.id, clientSelect);
    setClients(prev => prev.map(c => (c.id === updated.id ? updated : c)));

    setEdit(false);

    if (edit) {
      setVisibleEdit(false);
      setEdit(false)
    }
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
  }
};

const handleAddClient = async (newClient: any) => {
  try {
    const created = await customerService.post(newClient);
    setClients(prev => [...prev, created]);
    setVisibleAdd(false);
  } catch (error) {
    console.error("Error al añadir cliente:", error);
  }
};

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;

  setClientSelect((prev: any) => ({
    ...prev,
    [name]: value,
  }));

  if (value.trim() === "") {
    setEdit(false);
    setAdd(false);
  } else {
    setEdit(true);
    setAdd(true);
  }
};

const handleDelete = async (id: number) => {
  try {
    await customerService.delete(id);
    setClients(prev => prev.filter(c => c.id !== id));
    setVisibleEdit(false);
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
  }
};

  return (
    <div className="flex absolute flex-col w-screen h-screen overflow-x-hidden">

      <div className="bg-[#DEE8ED] absolute size-full flex flex-col">

        <div>
        <Navbar search={search} onSearchChange={setSearch}></Navbar>
        </div>
        
        <div className="flex w-full h-full bg-[#DEE8ED]">
          <Sidebar></Sidebar>
          <div className="w-[378px] h-full bg-[#E9EEF0]">
            <div className="pl-8 mt-8 flex items-center justify-between pr-4">
              <h2 className="font-Lato text-2xl">Lista de Clientes</h2>
              <button className={`w-[94px] border rounded-3xl py-2 font-Lato text-base mr-4 transition duration-300 
              ${visibleAdd == true ? "bg-white text-gray1 border-gray2 hover:bg-gray2 hover:border-gray2" 
              : 
              "bg-blue-500 text-white border-blue-500 hover:bg-blue-800 hover:border-blue-800" }`}
              onClick={() => {
                setVisibleAdd(true);
                setVisibleEdit(false);
                setClientSelect({
                  id_number: "",
                  phone: "",
                  name: "",
                  last_name: "",
                  email: "",
                  address: "",
                }); 
              }}
              >Añadir</button>
            </div>

            <div className="w-full h-auto pl-8">
              <h3 className="font-Lato font-medium text-base text-gray1">Todos los clientes registrados <br />en sistema</h3>
            </div>

            <div className="w-full sm:h-96 xl:h-[520px] flex flex-col overflow-y-auto mt-11">
              <div className="space-y-2">
                {currentClients.map((items) => (
                  <div className="w-full pl-8 pr-18 flex">
                    <div className={`w-full h-auto rounded-xl pb-4 font-lato text-black text-base shadow transition duration-300 
                    ${clientSelect === items ? "bg-blue-500 text-white" : "bg-white text-black"}
                    `}
                      onClick={() => {
                        setClientSelect(items);
                        setVisibleEdit(true);
                        setVisibleAdd(false)
                      }}>
                      <h2 className="w-full h-auto ml-4 mt-4 font-medium">{items.name}</h2>
                      <h3 className="w-full h-auto ml-4 font-medium">{items.last_name}</h3>
                      <h4 className="mt-1 ml-4">{items.id_number}</h4>
                      <h5 className="mt-5 justify-end w-full flex pr-4">Facturas: </h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pl-8 mt-6 mb-8 pr-19 w-full flex gap-2 flex-wrap font-Lato font-medium">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  className={`size-[42px] border rounded-full active:outline-0 
                  ${activePage === num 
                  ? "bg-blue-500 text-white" 
                  : "bg-white border-gray2 text-gray1"}`}
                  onClick={() => setActivePage(num)}
                >
                  {num}
                </button>
              ))}
            </div>
            <h2 className="pl-8 font-Lato font-medium text-base text-gray1">Mostrando {currentClients.length} de {filteredClients.length} resultados...</h2>
          </div>
          
          {visibleEdit && (
          <EditClient
            clientSelect={clientSelect}

            edit={edit}
            handleSave={handleSave}
            handleChange={handleChange}
            handleDelete={handleDelete}
          />
          )}

          {visibleAdd && <AddClient
              visibleAdd= {visibleAdd}
              setVisibleAdd={setVisibleAdd} 
              clientSelect={clientSelect}
              setClientSelect={setClientSelect}
              add={add}
              handleAddClient={handleAddClient}
              handleChange={handleChange}
          />}
          
        </div>
      </div>
    </div>
  );

};

