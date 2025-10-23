import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useBestSellersWeek } from "../hooks/useBestSellersWeek";

const BestSellersCard: React.FC = () => {
  const { data } = useBestSellersWeek(5);
  return (
    <div className="flex flex-col w-full space-y-6">
      <h2 className="font-Lato text-2xl">Productos más vendidos (7 días)</h2>
      <div className="w-full h-70 bg-white rounded-2xl shadow-sm">
        <div className="justify-between flex flex-col h-full p-4">
          <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} dx={-5} dy={10} height={40} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "white", borderRadius: 8, border: "1px solid #ccc" }} />
                <Bar dataKey="qty" fill="#2B7FFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestSellersCard;
