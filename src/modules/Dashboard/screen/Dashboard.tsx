import { RootLayout } from "../../../_Layouts/RootLayout";
import IncomeCard from "../components/IncomeCard";
import ProductsCard from "../components/ProductsPieChart"
import { InvoiceHistoryTable } from "../../Invoices/components/InvoiceHistoryTable"
import { useInvoiceHistoryDashboard } from "../hooks/useInvoiceHistoryDashboard";
import { useState } from "react";
import type { TInvoiceEndpoint } from "../../Invoices/models/types/TInvoiceEndpoint";
import { InvoiceDetailModal } from "../../Invoices/components/InvoiceDetailModal";
import Pagination from "../../../components/pagination";

export const Dashboard = () => {

  const [selectedInvoice, setSelectedInvoice] = useState<TInvoiceEndpoint | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

   const {
    currentInvoices,
    totalPages,
    activePage,
    setActivePage,
    pagesDisplay,
    canPrev,
    canNext,
    goPrev,
    goNext,
  } = useInvoiceHistoryDashboard();


const data = [
  { name: "Agp", value: 15000000 },
  { name: "Sep", value: 18000000 },
  { name: "Oct", value: 23123000 },
];

  return (

    
    <RootLayout search="" setSearch={()=>{}}>
      <div className="w-[90%] bg-gray3 flex-col">

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

        <div className="w-full px-8 mt-8 space-y-4">
        <div className="flex w-full justify-between">
          <h2 className="text-2xl font-Lato">Historial de Facturas más recientes</h2>
          <div className="flex space-x-4">

            <div className="relative">
              <select className="appearance-none w-[94px] border py-2 rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base focus:outline-blue-500 focus:outline-2">
                <option>24h</option>
                <option>72h</option>
              </select>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 fill-gray1">
                  <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clip-rule="evenodd" />
                </svg>
              </div>

              <div className="relative">
              <select className="appearance-none w-[220px] border py-2 rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base focus:outline-blue-500 focus:outline-2">
                <option>De Menor a Mayor</option>
                <option>De Mayor a Menor</option>
              </select>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 fill-gray1">
                  <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
        </div>

        <InvoiceHistoryTable
        data={currentInvoices}
        onSelect={(inv) => {
        setSelectedInvoice(inv);
        setDetailOpen(true);
        }}
        />

        <Pagination
        totalPages={totalPages}
        activePage={activePage}
        setActivePage={setActivePage}
        canPrev={canPrev}
        canNext={canNext}
        goPrev={goPrev}
        goNext={goNext}
        pagesDisplay={pagesDisplay}
        />
        </div>

        
         <InvoiceDetailModal
            open={detailOpen}
            invoice={selectedInvoice}
            onClose={() => setDetailOpen(false)}
          />
        
      </div>
    </RootLayout>
  );
};
