import { Sidebar } from '../../Product/components/Sidebar';
import { SearchBar } from '../../Product/components/SearchBar';


export const Home = () => {
  
  const searchProducts = (query: string) => {

  };

  const handleSearch = (query: string) => {
    searchProducts(query);
  };

  return (
    <div className='flex bg-[#DEE8ED]'>
      <Sidebar />
      <div className='flex-1'>
      <div className="bg-white p-4 flex justify-between items-center shadow-md">
          <SearchBar onSearch={handleSearch} placeholder="Buscar productos..." />
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-xl">🔔</span>
            <span className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gray-300"></span>
              Administrador
            </span>
          </div>
        </div>


      <div className='flex-col'>

      
        <div className='flex w-full justify-center h-auto '>

          <div className='mt-8 flex space-x-4'>

            <div className='flex w-96 h-36 bg-white'>
              <div className='flex flex-col justify-between w-full mr-4 ml-4 mt-4 mb-6'>
                  <div className='flex justify-between'>
                    <h2 className='text-black text-2xl'>Ingresos</h2>
                    <h3 className='text-black/50 font-light text-[20px]'>Julio 2024</h3>
                  </div>
                    <h4 className='text-5xl font-bold'>₡200,000</h4>
              </div>
              <div className="w-3 h-full bg-[#10B981]"></div>
            </div>

            <div className='flex w-96 h-36 bg-white'>
              <div className='flex flex-col justify-between w-full mr-4 ml-4 mt-4 mb-6'>
                  <div className='flex justify-between'>
                    <h2 className='text-black text-2xl'>Egresos</h2>
                    <h3 className='text-black/50 font-light text-[20px]'>Julio 2024</h3>
                  </div>
                    <h4 className='text-5xl font-bold'>₡200,000</h4>
              </div>
              <div className="w-3 h-full bg-[#EDAD2D]"></div>
            </div>

            <div className='flex w-96 h-36 bg-white'>
              <div className='flex flex-col justify-between w-full mr-4 ml-4 mt-4 mb-6'>
                  <div className='flex justify-between'>
                    <h2 className='text-black text-2xl'>Beneficios</h2>
                    <h3 className='text-black/50 font-light text-[20px]'>Julio 2024</h3>
                  </div>
                    <h4 className='text-5xl font-bold'>₡200,000</h4>
              </div>
              <div className="w-3 h-full bg-[#2F6AF2]"></div>
            </div>

          </div>
        </div>
          
          <div className='m-4 font-bold'>
            <h2 className='text-4xl text-black'>Historial de transacciones</h2>
          </div>

        <div className='flex w-full pl-4 pr-4'>
          <table className='border-collapse border-black/50 w-full'>
            <thead>
              <tr>
              <th className='pb-4 text-left'>Factura</th>
              <th className='pb-4 text-left'>Fecha</th>
              <th className='pb-4 text-left'>Cliente</th>
              <th className='pb-4 text-left'>Monto</th>
              <th className='pb-4 text-left'>Acciones</th>
              </tr>
            </thead>
            <tbody className='bg-white'>
              <tr >
                <td className='border-1 p-2'>#09287</td>
                <td className='border-1 p-2'>12-08-2022    5:12p.m</td>
                <td className='border-1 p-2'>Inolasa S,A</td>
                <td className='border-1 p-2'>₡12000</td>
                <td className='border-1 text-center p-2'>Visualización</td>
              </tr>
              <tr>
                <td className='border-1 p-2'>#09287</td>
                <td className='border-1 p-2'>12-08-2022    5:12p.m</td>
                <td className='border-1 p-2'>Inolasa S,A</td>
                <td className='border-1 p-2'>₡12000</td>
                <td className='border-1 text-center p-2'>Visualización</td>
              </tr>
              <tr>
                 <td className='border-1 p-2'>#09287</td>
                <td className='border-1 p-2'>12-08-2022    5:12p.m</td>
                <td className='border-1 p-2'>Inolasa S,A</td>
                <td className='border-1 p-2'>₡12000</td>
                <td className='border-1 text-center p-2'>Visualización</td>
              </tr>
              <tr>
                <td className='border-1 p-2'>#09287</td>
                <td className='border-1 p-2'>12-08-2022    5:12p.m</td>
                <td className='border-1 p-2'>Inolasa S,A</td>
                <td className='border-1 p-2'>₡12000</td>
                <td className='border-1 text-center p-2'>Visualización</td>
              </tr>
              <tr>
                <td className='border-1 p-2'>#09287</td>
                <td className='border-1 p-2'>12-08-2022    5:12p.m</td>
                <td className='border-1 p-2'>Inolasa S,A</td>
                <td className='border-1 p-2'>₡12000</td>
                <td className='border-1 text-center p-2'>Visualización</td>
              </tr>
            </tbody>

          </table>
          </div>

        </div>

    </div>
   </div>
);

};