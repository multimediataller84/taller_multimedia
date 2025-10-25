import { useEffect, useState } from "react";
import { reportsRepository } from "../../Reports/repositories/reportsRepository";

export function useCreditsSummary() {
  const [totalAssigned, setTotalAssigned] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const credits = await reportsRepository.getCredits();
        const assigned = credits.reduce((acc, c) => acc + Number(c.approved_credit_amount || 0), 0);
        const remaining = credits.reduce((acc, c) => acc + Number(c.balance || 0), 0);
        const debt = Math.max(assigned - remaining, 0);
        setTotalAssigned(assigned);
        setTotalDebt(debt);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { totalAssigned, totalDebt, loading };
}
