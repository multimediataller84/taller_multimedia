import { useEffect, useState } from "react";
import { CustomerService } from "../services/customerService";
import { TCustomerEndpoint } from "../models/types/TCustomerEndpoint";
import { TProvince } from "../models/types/TProvince";
import { TCanton } from "../models/types/TCanton";
import { TDistrict } from "../models/types/TDistrict";
import { TCustomer } from "../models/types/TCustomer";

const customerService = CustomerService.getInstance();

export const useClient = () => {
  const [clients, setClients] = useState<TCustomerEndpoint[]>([]);
  const [clientSelect, setClientSelect] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [provinces, setProvinces] = useState<TProvince[]>([]);
  const [cantons, setCantons] = useState<TCanton[]>([]);
  const [districts, setDistricts] = useState<TDistrict[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

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

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / clientsPerPage));
  const canPrev = activePage > 1;
  const canNext = activePage < totalPages;
  const goPrev = () => setActivePage((p) => Math.max(1, p - 1));
  const goNext = () => setActivePage((p) => Math.min(totalPages, p + 1));

  const pagesDisplay: Array<number | string> = (() => {
    const out: Array<number | string> = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) out.push(i);
      return out;
    }
    out.push(1);
    const windowStart = Math.max(2, activePage - 1);
    const windowEnd = Math.min(totalPages - 1, activePage + 1);
    if (windowStart > 2) out.push("...");
    for (let i = windowStart; i <= windowEnd; i++) out.push(i);
    if (windowEnd < totalPages - 1) out.push("...");
    out.push(totalPages);
    return out;
  })();

  const [confirmationEditClient, setConfirmationEditClient] = useState(false);
  const [confirmationAddClient, setConfirmationAddClient] = useState(false);
  const [confirmationDeleteClient, setConfirmationDeleteClient] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")

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

    useEffect(() => {
    const fetchLocations = async () => {
      try {
        const [provincesData, cantonsData, districtsData] = await Promise.all([
          customerService.getAllProvinces(),
          customerService.getAllCantons(),
          customerService.getAllDistricts(),
        ]);

        setProvinces(provincesData);
        setCantons(cantonsData);
        setDistricts(districtsData);
      } catch (error) {
        console.error("Error al cargar datos de ubicación:", error);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
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

  const handleAddClient = async (newClient: TCustomer) => {
  try {
    await customerService.post(newClient);

    const data = await customerService.getAll(); 
    setClients(data);

    setVisibleAdd(false);
    if (add) {
      setConfirmationAddClient(true);
      setTimeout(() => {
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
      } catch (error: any) {
    console.error("Error al eliminar cliente:", error);

    const backendError = error?.response?.data?.error || "";

    if (
      backendError.includes("violates foreign key constraint") &&
      backendError.includes("credits_customer_id_fkey")
    ) {
      setErrorMessage("No se puede eliminar este cliente porque \ntiene créditos o facturas asociadas.");
      setVisibleEdit(false);
      setClientSelect(null);
    } else {
      setErrorMessage("Ocurrió un error al eliminar el cliente. Intente nuevamente.");
      setVisibleEdit(false);
      setClientSelect(null);
    }

    setTimeout(() => {
      setErrorMessage("");
    }, 2000);
  }
  }

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
    setConfirmationDeleteClient,
    totalPages,
    canPrev,
    canNext,
    goPrev,
    goNext,
    pagesDisplay,
    provinces,
    cantons,
    districts,
    loadingLocations,
    errorMessage,
    setErrorMessage
  };
};