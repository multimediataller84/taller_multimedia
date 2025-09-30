import { useEffect, useMemo, useState } from "react";
import { CustomerService } from "../../ClientsModule/services/customerService";
import { TCustomerEndpoint } from "../../ClientsModule/models/types/TCustomerEndpoint";

const customerService = CustomerService.getInstance();

export const useInvoices = () => {
  const [clients, setClients] = useState<TCustomerEndpoint[]>([]);
  const [loadingClients, setLoadingClients] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<TCustomerEndpoint | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await customerService.getAll();
        setClients(data);
      } catch (e) {
        console.error("Error al cargar clientes para facturas", e);
      } finally {
        setLoadingClients(false);
      }
    };
    fetch();
  }, []);

  const filteredClients = useMemo(() => {
    if (!query.trim()) return clients;
    const q = query.toLowerCase();
    return clients.filter((c) =>
      `${c.name} ${c.last_name} ${c.id_number}`.toLowerCase().includes(q)
    );
  }, [clients, query]);

  const handleSelectClient = (client: TCustomerEndpoint) => {
    setSelectedClient(client);
    setQuery(`${client.name} ${client.last_name}`);
  };

  return {
   
    clients,
    loadingClients,
    query,
    setQuery,
    filteredClients,
    selectedClient,
    handleSelectClient,
    setSelectedClient,
  };
};
