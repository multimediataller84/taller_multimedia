import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useBestSellersWeek } from "../hooks/useBestSellersWeek";

const BestSellersCard: React.FC = () => {
  const { data } = useBestSellersWeek(5);
  return (
    <div className="flex flex-col w-full space-y-6">
      <h2 className="font-Lato text-2xl tracking-tight">Productos más vendidos (7 días)</h2>
      <div className="w-full h-70 bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:shadow-md relative overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-3 bg-blue-400 rounded-l-2xl" aria-hidden="true" />
        <div className="justify-between flex flex-col h-full p-4 pl-6">
          <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2B7FFF" stopOpacity={1} />
                    <stop offset="100%" stopColor="#193cb8" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F7" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  interval={0}
                  angle={-15}
                  dx={-5}
                  dy={10}
                  height={40}
                />
                <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} />
                <Tooltip
                  cursor={{ fill: "rgba(43,127,255,0.08)" }}
                  contentStyle={{ backgroundColor: "white", borderRadius: 10, border: "1px solid #E5E7EB" }}
                  itemStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="qty" fill="url(#barGradient)" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestSellersCard;
