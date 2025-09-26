import { Navbar, SerachProps } from "../components/navbar";
import { Sidebar } from "../components/Sidebar";

export const RootLayout = ({
  children,
  search = "",
  setSearch = () => {},
}: React.PropsWithChildren<SerachProps>) => {
  return (
    <div className="flex flex-col bg-backgroundBlue size-screen overflow-x-hidden ">
      <Navbar search={search} setSearch={setSearch} />
      <div className="flex w-full flex-grow">
        <Sidebar></Sidebar>
        {children}
      </div>
    </div>
  );
};
