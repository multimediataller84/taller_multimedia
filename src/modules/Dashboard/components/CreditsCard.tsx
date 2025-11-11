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
      <h2 className="font-Lato text-2xl tracking-tight">Creditos</h2>
      <div className="w-full h-70 bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:shadow-md relative overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-3 bg-orange-500 rounded-l-2xl" aria-hidden="true" />
        <div className="justify-between flex flex-col h-full p-5 pl-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl font-medium text-gray-700">Usuarios con crédito</span>
              <span className="text-xl px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 font-semibold">{usersPct}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${usersPct}%`,
                  background:
                    "linear-gradient(90deg, rgba(255,159,67,1) 0%, rgba(255,112,67,1) 100%)",
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
              <span>{usersWithCredit.toLocaleString("es-CR")} con crédito</span>
              <span>{totalUsers.toLocaleString("es-CR")} usuarios</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl font-medium text-gray-700">Deuda total</span>
              <span className="text-xl px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold">{debtPct}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${debtPct}%`,
                  background:
                    "linear-gradient(90deg, rgba(43,127,255,1) 0%, rgba(25,60,184,1) 100%)",
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
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


