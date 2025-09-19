import SearchBar from "../components/SearchBar";

export const Navbar = () => {

      const search = (query: string) => {
    };


    const handleSearch = (query: string) => {
    search(query);
    };

  return (
        
    <div className="flex w-full h-[102px] bg-white">
            
        <div className='flex justify-center w-full items-center'>
           
            <h1 className='w-[94px] ml-4 text-2xl leading-none font-lato text-gray1 text-center'>logo</h1>
            
            <div className='flex justify-center w-full'>
            <SearchBar 
                placeholder="Buscar"
            ></SearchBar>
            </div>
            
        </div>

    </div>
  );
};
