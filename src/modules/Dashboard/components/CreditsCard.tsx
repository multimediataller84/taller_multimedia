import React from "react";
import { useCreditsSummary } from "../hooks/useCreditsSummary";

const CreditsCard: React.FC = () => {
  const { totalAssigned, totalDebt, totalUsers, usersWithCredit } = useCreditsSummary();
  const assigned = Math.max(Number(totalAssigned || 0), 0);
  const debt = Math.max(Number(totalDebt || 0), 0);
  const debtPct = assigned > 0 ? Math.round((debt / assigned) * 100) : 0;
  const usersPct = totalUsers > 0 ? Math.round((usersWithCredit / totalUsers) * 100) : 0;
  return (
    <div className="flex flex-col w-full space-y-6">
      <h2 className="font-Lato text-2xl">Creditos</h2>
      <div className="w-full h-70 bg-white rounded-2xl shadow-sm">
        <div className="justify-between flex flex-col h-full p-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-medium">Usuarios con crédito</span>
              <span className="text-sm text-gray-600">{usersPct}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-3 bg-orange-500" style={{ width: `${usersPct}%` }} />
            </div>
            <div className="flex items-center justify-between mt-2 text-sm text-gray-700">
              <span>{usersWithCredit.toLocaleString("es-CR")} con crédito</span>
              <span>{totalUsers.toLocaleString("es-CR")} usuarios</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-medium">Deuda total</span>
              <span className="text-sm text-gray-600">{debtPct}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-3 bg-blue-500" style={{ width: `${debtPct}%` }} />
            </div>
            <div className="flex items-center justify-between mt-2 text-sm text-gray-700">
              <span>₡{debt.toLocaleString("es-CR")}</span>
              <span>₡{assigned.toLocaleString("es-CR")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditsCard;

