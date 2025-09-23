import SearchBar from "../components/SearchBar";

type NavbarProps = {
  search?: string;
  onSearchChange?: (value: string) => void;
};

export const Navbar = ({ search, onSearchChange }: NavbarProps) => {

  return (
        
    <div className="flex w-full h-[102px] bg-white">
            
        <div className='flex justify-center w-full items-center'>
           
            <h1 className='w-[94px] ml-4 text-2xl leading-none font-lato text-gray1 text-center'>logo</h1>
            
            <div className='flex justify-center w-full'>
            <SearchBar 
                placeholder="Buscar"
                value={search}
                onChange={onSearchChange}
                inputAriaLabel="Buscar global"
            ></SearchBar>
            </div>
            
        </div>

    </div>
  );
};
