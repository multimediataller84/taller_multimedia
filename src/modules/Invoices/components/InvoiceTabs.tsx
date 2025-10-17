import React from "react";
import type { TInvoiceTab } from "../models/types/TInvoiceTab";

interface Props {
  active: TInvoiceTab;
  onChange: (t: TInvoiceTab) => void;
}

export const InvoiceTabs: React.FC<Props> = ({ active, onChange }) => {
  return (
    <div className="flex flex-col w-full ">
      <div className="flex w-full space-y-4 font-lato font-medium">
        <h2
          className={`w-1/2 text-center ${active === "generar" ? "text-blue-500" : "text-gray1"}`}
          onClick={() => onChange("generar")}
        >
          Factura
        </h2>
        <h3
          className={`w-1/2 text-center ${active === "historial" ? "text-blue-500" : "text-gray1"}`}
          onClick={() => onChange("historial")}
        >
          Historial de Facturas
        </h3>
      </div>
      <div className="w-full h-1 bg-graybar relative">
        <div
          className={`h-1 w-1/2 bg-blue-500 transition-transform duration-150 ease-in-out
            ${active === "generar" ? "translate-x-0" : "translate-x-full"}`}
        ></div>
      </div>
    </div>
  );
};
