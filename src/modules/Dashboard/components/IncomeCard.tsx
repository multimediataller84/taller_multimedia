import React from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useIncomeTrend } from "../hooks/useIncomeTrend";

const IncomeCard: React.FC = () => {
  const {
    months,
    selectedMonthKey,
    setSelectedMonthKey,
    dailyPoints,
    current,
    currentMonthName,
    currentYear,
  } = useIncomeTrend();
  return (
    <div className="flex flex-col w-full space-y-6">
      <h1 className="font-Lato text-2xl tracking-tight">Ingresos</h1>

      <div className="w-full h-70 bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:shadow-md relative overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-3 bg-blue-600 rounded-l-2xl" aria-hidden="true" />
        <div className="justify-between flex flex-col h-full pl-5">
          {/* Monto y fecha */}
          <div className="mt-6 space-y-2">
            <h2 className="text-5xl font-Lato font-medium ml-4">
              ₡{current.toLocaleString("es-CR")}
            </h2>
            <h3 className="text-2xl font-Lato font-medium ml-6 text-gray-600">
              {currentMonthName}, {currentYear}
            </h3>
          </div>

          {/* Gráfico lineal entre el monto y los meses */}
          <div className="w-full h-20 px-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyPoints}
                margin={{ top: 5, right: 15, left: 15, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F7" /> 
                <defs>
                  <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2B7FFF" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#2B7FFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                    padding: "10px 12px",
                  }}
                  labelStyle={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}
                  itemStyle={{ fontSize: 16 }}
                  labelFormatter={(label) => `día ${label}`}
                  formatter={(value) => [
                    Number(value).toLocaleString("es-CR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }),
                    "venta",
                  ]}
                  cursor={{ stroke: "#2B7FFF", strokeDasharray: "4 4" }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2B7FFF"
                  strokeWidth={3}
                  dot={{ r: 3, stroke: "#2B7FFF", strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 6, stroke: "#1E40AF", strokeWidth: 2, fill: "#fff" }}
                  fill="url(#colorLine)"
                                  />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Meses abajo */}
          <div className="flex justify-start ml-6 mb-6 space-x-3 text-base">
            {months.map((m) => (
              <button
                key={m.key}
                onClick={() => setSelectedMonthKey(m.key)}
                className={`px-3 py-1 rounded-full transition-all duration-200 ${m.key === selectedMonthKey ? "bg-blue-600 text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeCard;
