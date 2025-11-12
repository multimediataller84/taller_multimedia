import { CashRegisterService } from "../services/cashRegisterService"
import { TCashRegisterWithUser, TCloseRegister, TOpenRegister } from "../models/interfaces/ICashRegisterService"
import { useEffect, useState } from "react";

const cashRegisterService = CashRegisterService.getInstance();

export const useCashRegister = () => {
    const [cashRegister, setCashRegister] = useState<TCashRegisterWithUser[]>([]);
    const [cashRegisterSelect, setCashRegisterSelect] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    const [visibleEdit, setVisibleEdit] = useState(false);

    const [add, setAdd] = useState(false);
    const [visibleAdd, setVisibleAdd] = useState(false);

    const [visibleOpen, setVisibleOpen] = useState(false);
    const [visibleClose, setVisibleClose] = useState(false);

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

      const totalPages = Math.max(1, Math.ceil(filteredCashRegister.length / cashRegisterPerPage));
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

    const currentCashRegister = filteredCashRegister.slice(
      indexOfFirstCashRegister,
      indexOfLastCashRegister
    );


    const [confirmationAddCashRegister, setConfirmationAddCashRegister] = useState(false);
    const [confirmationCloseCashRegister, setConfirmationCloseCashRegister] = useState(false);
    const [confirmationDeleteCashRegister, setConfirmationDeleteCashRegister] = useState(false);
    const [confirmationOpenCashRegister, setConfirmationOpenCashRegister] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")


    const fetchCashRegister = async () => {
      try {
        const data = await cashRegisterService.getAll();
        setCashRegister(data);
      } catch (error) {
        console.error("Error al cargar cajas:", error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchCashRegister();
    }, []);

    const handleAddCashRegister = async (newCashRegister: any) => {
      try {
        setLoading(true);

        const dataToSend = {
          ...newCashRegister,
          opening_amount: newCashRegister.amount,
        };

        await cashRegisterService.post(dataToSend);

        await fetchCashRegister();

        setVisibleAdd(false);
        setConfirmationAddCashRegister(true);
        setTimeout(() => {
          setConfirmationAddCashRegister(false);
        }, 2000);
        console.log("Caja agregada y lista actualizada correctamente");
      } catch (error) {
        console.error("Error al añadir caja:", error);
      } finally {
        setLoading(false);
      }
    };

  const handleOpenCashRegister = async (id: number, data: TOpenRegister) => {
    try {
      setLoading(true);
      await cashRegisterService.open(id, data);
      await fetchCashRegister(); 
      console.log("Caja abierta correctamente y lista actualizada");
      setConfirmationOpenCashRegister(true);
      setTimeout(() => {
          setConfirmationOpenCashRegister(false);
      }, 2000);
    } catch (error) {
      console.error("Error al abrir la caja:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseCashRegister = async (id: number, data: TCloseRegister) => {
    try {
      setLoading(true);
      await cashRegisterService.close(id, data);
      await fetchCashRegister(); 
      console.log("Caja cerrada correctamente y lista actualizada");
      setConfirmationCloseCashRegister(true);
      setTimeout(() => {
          setConfirmationCloseCashRegister(false);
      }, 2000);
    } catch (error) {
      console.error("Error al cerrar la caja:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await cashRegisterService.delete(id);
      setCashRegister((prev) => prev.filter((c) => c.id !== id));
      setVisibleEdit(false);
      setConfirmationDeleteCashRegister(true);
      setTimeout(() => {
          setConfirmationDeleteCashRegister(false);
      }, 2000);
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    }
  };

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
  const { name, value } = e.target;
    setCashRegisterSelect((prev: any) => ({
      ...prev,
      [name]:
        name === "amount" || name === "opening_amount" || name === "closing_amount"
          ? value === "" 
            ? "" 
            : Number(value)
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
    cashRegisterSelect,
    setCashRegisterSelect,
    loading,
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
    handleChange,
    handleOpenCashRegister,
    visibleOpen,
    setVisibleOpen,
    handleCloseCashRegister,
    visibleClose,
    setVisibleClose,
    handleDelete,
    totalPages,
    canPrev,
    canNext,
    goPrev,
    goNext,
    pagesDisplay,
    confirmationAddCashRegister, 
    setConfirmationAddCashRegister,
    confirmationCloseCashRegister, 
    setConfirmationCloseCashRegister,
    confirmationDeleteCashRegister, 
    setConfirmationDeleteCashRegister,
    confirmationOpenCashRegister, 
    setConfirmationOpenCashRegister,
    errorMessage, 
    setErrorMessage
  }
}