import { RootLayout } from "../../../_Layouts/RootLayout";
import IncomeCard from "../components/IncomeCard";
import ProductsCard from "../components/ProductsPieChart"
import CreditsCard from "../components/CreditsCard";
import BestSellersCard from "../components/BestSellersCard";
import { useState } from "react";

export const Dashboard = () => {

  const [search, setSearch] = useState<string>("");
    
  return (

    <RootLayout search={search} setSearch={setSearch} showSearch={false}>
      <div className="w-[90%] h-screen bg-gray3 flex-col">

        <div className="grid w-full h-auto grid-cols-12 gap-6 px-8 mt-8">
          <div className="col-span-12 lg:col-span-7">
            <IncomeCard />
          </div>

          <div className="col-span-12 lg:col-span-5">
            <ProductsCard />
          </div>

          <div className="col-span-12 lg:col-span-6">
            <CreditsCard />
          </div>

          <div className="col-span-12 lg:col-span-6">
            <BestSellersCard />
          </div>
        </div>
          
      </div>
    </RootLayout>
  );
};
