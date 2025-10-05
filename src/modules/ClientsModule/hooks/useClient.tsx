import { useEffect, useState } from "react";
import { CustomerService } from "../services/customerService";
import { TCustomerEndpoint } from "../models/types/TCustomerEndpoint";

const customerService = CustomerService.getInstance();

export const useClient = () => {
  const [clients, setClients] = useState<TCustomerEndpoint[]>([]);
  const [clientSelect, setClientSelect] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [edit, setEdit] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);

  const [add, setAdd] = useState(false);
  const [visibleAdd, setVisibleAdd] = useState(false);

  const [activePage, setActivePage] = useState(1);
  const clientsPerPage = 10;

  const [search, setSearch] = useState("");
  const filteredClients = clients.filter((c) => {
    const fullName = `${c.name} ${c.last_name} ${c.id_number}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  const indexOfLastClient = activePage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  
  const currentClients = filteredClients.slice(
    indexOfFirstClient,
    indexOfLastClient
  );

  const [confirmationEditClient, setConfirmationEditClient] = useState(false);
  const [confirmationAddClient, setConfirmationAddClient] = useState(false);
  const [confirmationDeleteClient, setConfirmationDeleteClient] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await customerService.getAll();
        setClients(data);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      }finally {
        setLoading(false); 
      }
    };
    fetchClients();
  }, []);

  const handleSave = async () => {
    if (!clientSelect) return;
    try {
      const updated = await customerService.patch(
        clientSelect.id,
        clientSelect
      );
      setClients((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );

      setEdit(false);

      if (edit) {
        setVisibleEdit(false);
        setEdit(false);
        setConfirmationEditClient(true);
        setClientSelect(false);
      setTimeout(() => {
        setConfirmationEditClient(false);
      }, 2000);
      }
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
    }
  };

  const handleAddClient = async (newClient: any) => {
    try {
      const created = await customerService.post(newClient);
      setClients((prev) => [...prev, created]);
      setVisibleAdd(false);
      if (add){
        setConfirmationAddClient(true);
        setTimeout(()=>{
          setConfirmationAddClient(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error al añadir cliente:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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
      setClients((prev) => prev.filter((c) => c.id !== id));
      setVisibleEdit(false);
      setConfirmationDeleteClient(true);
      setTimeout(()=>{
          setConfirmationDeleteClient(false);
        }, 2000);
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    }
  };

  return {
    search,
    setSearch,
    visibleAdd,
    setVisibleAdd,
    setVisibleEdit,
    setClientSelect,
    currentClients,
    clientSelect,
    activePage,
    setActivePage,
    clientsPerPage,
    visibleEdit,
    clients,
    edit,
    setEdit,
    add,
    setAdd,
    handleSave,
    handleChange,
    handleAddClient,
    handleDelete,
    loading,
    confirmationEditClient,
    setConfirmationEditClient,
    confirmationAddClient,
    setConfirmationAddClient,
    confirmationDeleteClient,
    setConfirmationDeleteClient
  };
};