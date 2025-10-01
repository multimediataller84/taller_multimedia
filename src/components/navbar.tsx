import { useState } from "react";
import { Link } from 'react-router-dom';
import { getRoleAuth } from "../utils/getRoleAuth";
import { getUsernameAuth } from "../utils/getUsernameAuth";
export interface SerachProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export const Navbar = (props: SerachProps) => {

  const [optionsMenu, setOptionsMenu] = useState(false);

  return (
        
    <div className="flex relative bg-white ">
            
        <div className='flex justify-between w-full h-24 items-center mr-4'>
           
            <h1 className='w-[94px] ml-4 text-2xl leading-none font-lato text-gray1 text-center'>logo</h1>
            
            <div className='flex justify-center w-full'>
            <input
              type="text"
              placeholder="Buscar"
              value={props.search}
              onChange={(e) => props.setSearch(e.target.value)}
              className={`w-[558px] h-9 pl-4 pb-1 
              placeholder:font-medium placeholder:font-Lato placeholder:text-base placeholder:text-gray1
              border border-gray2
              rounded-2xl 
              focus:outline-none focus:ring-2 focus:border-0 focus:ring-blue-500`}
            />
            </div>
          
          <div className="flex space-x-4">
            <div className="flex flex-col w-auto ">
              <h2 className="text-base">{getUsernameAuth()}</h2>
              <h3 className="text-sm">{getRoleAuth()}</h3>
            </div>

            <button className="rounded-full w-13 h-12 border border-gray2 group active:outline-hidden
            flex justify-center items-center bg-white transition duration-300 ease-in-out hover:scale-110 hover:bg-gray2"
            onClick={() => (setOptionsMenu(!optionsMenu))}
            >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                  className="size-5 fill-gray1">
                  <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 
                  0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 
                  0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 
                  0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
              </svg>
            </button>
                 </div>
          </div>

          {optionsMenu && <div className="bg-white absolute flex flex-col mt-[98px] right-0 mr-4 h-auto w-52 p-1 rounded-[4px] shadow-md text-gray1 z-100">
            <Link to="/profiles" className={`text-left px-4 font-lato text-base font-medium w-full py-4 hover:bg-gray3 hover:underline ${getRoleAuth() === "admin" ? "block": "hidden"}`}>Administración Perfiles</Link>
            <button className="text-left px-4 font-lato text-base font-medium w-full py-4 hover:bg-gray3 hover:underline">Configuración</button>
            <div className="flex-col flex">
              <div className="px-2 h-0.5 w-full bg-gray2"></div>
              <Link to="/" onClick={()=>{sessionStorage.clear()}} className="text-left px-4 w-full py-4 font-medium hover:bg-gray3 hover:underline">Cerrar Sesión</Link>
            </div>
          </div>}
            
      </div>
  );
};

