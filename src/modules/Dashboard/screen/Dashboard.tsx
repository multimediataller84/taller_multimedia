import { RootLayout } from "../../../_Layouts/RootLayout";

export const Dashboard = () => {
  return (
    <RootLayout search="" setSearch={()=>{}}>
      <div className="pl-8 mt-8 flex  justify-between">
        <h2 className="font-Lato text-2xl">Dashboard</h2>
      </div>
    </RootLayout>
  );
};
