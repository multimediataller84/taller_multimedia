import { Navbar } from "../../../components/navbar";
import { Sidebar } from "../../../components/Sidebar";

export const Dashboard = () => {
  return (
    <div className="flex absolute flex-col w-screen h-screen overflow-x-hidden">
      <div className="bg-[#DEE8ED] absolute size-full flex flex-col">
        <div>
          <Navbar></Navbar>
        </div>

        <div className="flex w-full h-full bg-[#DEE8ED]">
          <Sidebar></Sidebar>
          <div className="pl-8 mt-8 flex  justify-between">
            <h2 className="font-Lato text-2xl">Dashboard</h2>
          </div>
        </div>
      </div>
    </div>
  );
};
