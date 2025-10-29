import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useProductStats } from "../hooks/useProductStats";

interface PieData {
  name: string;
  value: number;
  [key: string]: string | number;
}

// Datos vienen del hook useProductStats

const COLORS: string[] = ["#2B7FFF", "#193cb8"]; 

type LegendEntry = { value: string | number; color: string };
type CustomLegendProps = { payload?: readonly LegendEntry[] };

const CustomLegend: React.FC<CustomLegendProps> = ({ payload }) => {
  const items = payload ?? [];
  return (
    <ul className="flex justify-center space-x-6 mt-2">
      {items.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center space-x-2 text-sm font-medium">
          <span className="w-3 h-3 inline-block rounded-full" style={{ backgroundColor: entry.color }} />
          <span className={String(entry.value) === "Productos inactivos" ? "text-gray-800" : "text-blue-600"}>
            {String(entry.value)}
          </span>
        </li>
      ))}
    </ul>
  );
};

const ProductsCard: React.FC = () => {
  const { active, inactive } = useProductStats();
  const data: PieData[] = [
    { name: "Productos activos", value: active },
    { name: "Productos inactivos", value: inactive },
  ];

  return (
    <div className="flex flex-col w-full space-y-6">
      <h1 className="font-Lato text-2xl tracking-tight">Stock de productos</h1>

      <div className="w-full bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:shadow-md flex flex-col h-70">
        {/* Título */}
        <h2 className="text-2xl font-Lato font-medium ml-4 mt-4 text-gray-700">Activos</h2>

        {/* Gráfica de pie centrada */}
        <div className="flex-1 flex items-center justify-center px-4">
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={40}
                outerRadius={70}
                label
              >
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                cursor={{ fill: "rgba(43,127,255,0.06)" }}
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  border: "1px solid #E5E7EB",
                  fontSize: "14px",
                }}
              />
              <Legend content={<CustomLegend />} verticalAlign="bottom" align="center" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProductsCard;
