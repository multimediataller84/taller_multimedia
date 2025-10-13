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
    const filteredCashRegister = cashRegister.filter((c) => {
    const userName = c.user?.name || ""; 
    const fullName = `${userName} ${c.id}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
    });

  const currentCashRegister = filteredCashRegister.slice(
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

    const handleAddCashRegister = async (newCashRegister: any) => {
    try {
      const created = await cashRegisterService.post(newCashRegister);
      setCashRegister((prev) => [...prev, created]);
      setVisibleAdd(false);
      if (add){
       
      }
    } catch (error) {
      console.error("Error al añadir cliente:", error);
    }
  };

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;

  setCashRegisterSelect((prev: any) => ({
    ...prev,
    [name]: name === "amount" || name === "opening_amount" || name === "closing_amount"
      ? Number(value) || 0   // 👈 convierte a número
      : value,
  }));

  if (value.trim() === "") {
    setAdd(false);
  } else {
    setAdd(true);
  }
};

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
    currentCashRegister,
    handleAddCashRegister,
    handleChange
  }
}