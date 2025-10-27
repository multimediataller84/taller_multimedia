import { RootLayout } from "../../../_Layouts/RootLayout";
import TaxExcelUploader from "../../Product/components/TaxExcelUploader";

export const Taxes = () => {
  return (
    <RootLayout search="" setSearch={()=>{}} showSearch={false}>
      <div className="flex w-[90%] p-8 h-screen bg-gray3 flex-col space-y-8">

        <h2 className="font-Lato text-2xl">Impuestos</h2>
        <div>
        <TaxExcelUploader/>
        </div>
      </div>

    </RootLayout>
  );
};
