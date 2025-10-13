import { useEffect, useState } from "react";
import { CashRegisterService } from "../services/cashRegisterService";
import type { TCashRegisterOpen } from "../models/types/TCashRegisterOpen";

const service = CashRegisterService.getInstance();

export const useOpenRegisters = () => {
  const [registers, setRegisters] = useState<TCashRegisterOpen[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.getOpenAll();
      setRegisters(Array.isArray(data) ? data.filter(r => (r.status?.toLowerCase?.() === 'open')) : []);
    } catch (e) {
      setError('No se pudieron cargar las cajas abiertas');
      setRegisters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return { registers, loading, error, refetch: fetchAll };
};
