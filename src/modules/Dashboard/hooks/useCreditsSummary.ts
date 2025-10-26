import { useEffect, useState } from "react";
import { reportsRepository } from "../../Reports/repositories/reportsRepository";
import { CustomerService } from "../../ClientsModule/services/customerService";

export function useCreditsSummary() {
  const [totalAssigned, setTotalAssigned] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersWithCredit, setUsersWithCredit] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [credits, customers] = await Promise.all([
          reportsRepository.getCredits(),
          CustomerService.getInstance().getAll(),
        ]);

        const assigned = credits.reduce((acc, c) => acc + Number(c.approved_credit_amount || 0), 0);
        const remaining = credits.reduce((acc, c) => acc + Number(c.balance || 0), 0);
        const debt = Math.max(assigned - remaining, 0);

        const totalUsersCount = Array.isArray(customers) ? customers.length : 0;
        const approvedCustomerIds = new Set<number>();
        for (const c of credits) {
          const st = String(c.status || "").toLowerCase();
          if (st === "aproved") {
            approvedCustomerIds.add(Number(c.customer_id));
          }
        }

        setTotalUsers(totalUsersCount);
        setUsersWithCredit(approvedCustomerIds.size);
        setTotalAssigned(assigned);
        setTotalDebt(debt);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { totalAssigned, totalDebt, totalUsers, usersWithCredit, loading };
}
