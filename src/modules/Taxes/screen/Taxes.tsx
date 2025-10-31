import { RootLayout } from "../../../_Layouts/RootLayout";
import TaxExcelUploader from "../../Product/components/TaxExcelUploader";

export const Taxes = () => {
  return (
    <RootLayout search="" setSearch={()=>{}} showSearch={false}>
      <div className="flex flex-col w-[90%] h-full bg-gray3 p-2 md:p-8 space-y-1 md:space-y-4">

        <h2 className="font-Lato text-base xl:text-lg 2xl:text-2xl pl-2 pt-2 sm:pl-0 sm:pt-0">Impuestos</h2>
        
        <TaxExcelUploader/>
        
      </div>

    </RootLayout>
  );
};
