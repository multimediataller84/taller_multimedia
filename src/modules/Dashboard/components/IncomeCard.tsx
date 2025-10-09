import React from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface DataPoint {
  name: string;
  value: number;
}

interface IncomeCardProps {
  amount: number;
  month: string;
  year: number;
  data: DataPoint[];
}

const IncomeCard: React.FC<IncomeCardProps> = ({ amount, month, year, data }) => {
  return (
    <div className="flex flex-col w-1/3 space-y-6">
      <h1 className="font-Lato text-2xl">Ingresos</h1>

      <div className="w-full h-70 bg-white rounded-2xl shadow-sm">
        <div className="justify-between flex flex-col h-full">
          {/* Monto y fecha */}
          <div className="mt-6 space-y-2">
            <h2 className="text-5xl font-Lato font-medium ml-4">
              ₡{amount.toLocaleString("es-CR")}
            </h2>
            <h3 className="text-2xl font-Lato font-medium ml-6">
              {month}, {year}
            </h3>
          </div>

          {/* Gráfico lineal entre el monto y los meses */}
          <div className="w-full h-20 px-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}
                margin={{ top: 5, right: 15, left: 15, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" /> 
                <defs>
                  <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2B7FFF" stopOpacity={0} />
                    <stop offset="100%" stopColor="#2B7FFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2B7FFF"
                  strokeWidth={4}
                  dot={true}
                  fill="url(#colorLine)"
                                  />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Meses abajo */}
          <div className="flex justify-start ml-6 mb-6 space-x-6 text-xl">
            <h4>Ago</h4>
            <h4>Sep</h4>
            <h4 className="font-semibold">Oct</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeCard;
