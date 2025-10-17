import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface PieData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface ProductsCardProps {
  active: number;
  inactive: number;
}

const COLORS: string[] = ["#2B7FFF", "#193cb8"]; 

const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex justify-center space-x-6 mt-2">
        {payload.map((entry: any, index: number) => (
          <li
            key={`item-${index}`}
            className="flex items-center space-x-1 text-sm font-medium"
          >
            <span
              className="w-3 h-3 inline-block rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span
              style={{
                color:
                  entry.value === "Productos inactivos"
                    ? "#000" 
                    : "#2B7FFF", 
              }}
            >
              {entry.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };

const ProductsCard: React.FC<ProductsCardProps> = ({ active, inactive }) => {
  const data: PieData[] = [
    { name: "Productos activos", value: active },
    { name: "Productos inactivos", value: inactive },
  ];

  return (
    <div className="flex flex-col w-1/4 space-y-6">
      <h1 className="font-Lato text-2xl">Productos</h1>

      <div className="w-full bg-white rounded-2xl shadow-sm flex flex-col h-70">
        {/* Título */}
        <h2 className="text-2xl font-Lato font-medium ml-4 mt-4">Activos</h2>

        {/* Gráfica de pie centrada */}
        <div className="flex-1 flex items-center justify-center px-4">
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={70}
                label
              >
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                }}
              />
              <Legend content={renderLegend} verticalAlign="bottom" align="center" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProductsCard;
