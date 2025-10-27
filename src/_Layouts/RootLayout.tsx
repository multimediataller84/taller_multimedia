import { Navbar, SearchProps } from "../components/navbar";
import { Sidebar } from "../components/Sidebar";

export const RootLayout = ({
  children,
  search = "",
  setSearch = () => {},
  showSearch = true,
}: React.PropsWithChildren<SearchProps>) => {
  return (
    <div className="flex flex-col bg-gray3 w-full min-h-screen overflow-x-hidden ">
      <Navbar search={search} setSearch={setSearch} showSearch={showSearch} />
      <div className="flex bg-gray3 w-full h-full flex-grow">
        <Sidebar></Sidebar>
        {children}
      </div>
    </div>
  );
};
