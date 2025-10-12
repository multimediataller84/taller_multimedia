import { CashRegisterService } from "../services/cashRegisterService"
import { TCashRegisterWithUser } from "../models/interfaces/ICashRegisterService"
import { useEffect, useState } from "react";

const cashRegisterService = CashRegisterService.getInstance();

export const useCashRegister = () => {
    const [cashRegister, setCashRegister] = useState<TCashRegisterWithUser[]>([]);
    const [cashRegisterSelect, setCashRegisterSelect] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [edit, setEdit] = useState(false);
    const [visibleEdit, setVisibleEdit] = useState(false);

    const [add, setAdd] = useState(false);
    const [visibleAdd, setVisibleAdd] = useState(false);

    const [activePage, setActivePage] = useState(1);
    const cashRegisterPerPage = 10;

    const indexOfLastCashRegister = activePage * cashRegisterPerPage;
    const indexOfFirstCashRegister = indexOfLastCashRegister - cashRegisterPerPage;
    
    const [search, setSearch] = useState("");
    const filteredClients = cashRegister.filter((c) => {
    const fullName = `${c.user.name} ${c.id}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  const currentCashRegister = filteredClients.slice(
    indexOfFirstCashRegister,
    indexOfLastCashRegister
  );

    useEffect(() => {
      const fetchCashRegister = async () => {
        try {
          const data = await cashRegisterService.getAll();
          setCashRegister(data);
        } catch (error) {
          console.error("Error al cargar cajas:", error);
        }finally {
          setLoading(false); 
        }
      };
      fetchCashRegister();
    }, []);

  return{
    cashRegister,
    setCashRegister,
    cashRegisterSelect,
    setCashRegisterSelect,
    loading,
    setLoading,
    edit,
    setEdit,
    visibleEdit,
    setVisibleEdit,
    add,
    setAdd,
    visibleAdd,
    setVisibleAdd,
    activePage,
    setActivePage,
    search,
    setSearch,
    currentCashRegister
  }
}