import { Navbar } from "../components/navbar"
import { Sidebar } from '../../Product/components/Sidebar';


export const Client = () => {


  return (
    <div className="flex absolute bg-amber-300 size-full">
        
        <section className="bg-red-500 size-full flex flex-col">
            <div>
            <Navbar></Navbar>
            </div>
           
           <div className="flex">
             <Sidebar></Sidebar>
             <h1>dsadas</h1>
           </div>
           
        </section>
        

    </div>
  );

};
