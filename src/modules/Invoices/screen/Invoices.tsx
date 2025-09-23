import { RootLayout } from "../../../_Layouts/RootLayout";

export const Invoices = () => {
  return (
    <RootLayout search="" setSearch={()=>{}}>
      <div className="pl-8 mt-8 flex  justify-between">
        <h2 className="font-Lato text-2xl">Facturas</h2>
      </div>
    </RootLayout>
  );
};
