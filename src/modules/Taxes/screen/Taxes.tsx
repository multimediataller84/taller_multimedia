import { RootLayout } from "../../../_Layouts/RootLayout";
import TaxExcelUploader from "../../Product/components/TaxExcelUploader";

export const Taxes = () => {
  return (
    <RootLayout search="" setSearch={()=>{}}>
      <div className="pl-8 mt-8 flex  justify-between">
        <h2 className="font-Lato text-2xl">Taxes</h2>
        <TaxExcelUploader/>
      </div>
    </RootLayout>
  );
};
