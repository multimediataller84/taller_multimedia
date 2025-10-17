import { RootLayout } from "../../../_Layouts/RootLayout";
import IncomeCard from "../components/IncomeCard";
import ProductsCard from "../components/ProductsPieChart"
import { Reports } from "../../Reports/screen/Reports";
import { useState } from "react";

export const Dashboard = () => {

  const data = [
    { name: "Agp", value: 15000000 },
    { name: "Sep", value: 18000000 },
    { name: "Oct", value: 23123000 },
  ];

  const [search, setSearch] = useState<string>("");
    
  return (

    <RootLayout search={search} setSearch={setSearch}>
      <div className="w-[90%] h-screen bg-gray3 flex-col">

        <div className="flex w-full h-auto space-x-4 justify-center px-8 mt-8">

          <IncomeCard amount={23123000} month="Octubre" year={2025} data={data} />

          <ProductsCard active={100} inactive={25} />

          <div className="flex flex-col w-1/4 space-y-6">
            <h2 className="font-Lato text-2xl">Creditos</h2>
            <div className="w-full h-70 bg-white rounded-2xl">
              
            </div>
          </div>

          <div className="flex flex-col w-1/4 space-y-6">
            <h2 className="font-Lato text-2xl">Beneficios</h2>
            <div className="w-full h-70 bg-white rounded-2xl">
              <div className="justify-between flex flex-col h-full">

              </div>
            </div>
          </div>
        </div>
          <Reports
          search={search}
          />
      </div>
    </RootLayout>
  );
};
