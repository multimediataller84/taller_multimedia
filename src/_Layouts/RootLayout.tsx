import React, { ReactNode } from "react";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/navbar";

type RootLayoutProps = {
  search?: string;
  setSearch?: React.Dispatch<React.SetStateAction<string>>;
  children: ReactNode;
};

export const RootLayout = ({ search, setSearch, children }: RootLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full bg-[#DEE8ED]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar
          search={search}
          onSearchChange={value => setSearch?.(value)}
        />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};
