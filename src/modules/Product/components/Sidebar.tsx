
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', icon: '', path: '/dashboard' },
  { name: 'Facturas', icon: '', path: '/facturas' },
  { name: 'Clientes', icon: '', path: '/clients' },
  { name: 'Inventario', icon: '', path: '/products' },
  { name: 'Impuestos', icon: '', path: '/impuestos' },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white flex flex-col justify-between h-full" >
      <div>
      <div className='ml-4'>
        <nav className="mt-4 flex flex-col space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`px-5 py-2.5 rounded-3xl transition-colors self-start hover:text-white
                ${location.pathname === item.path 
                ? 'bg-blue-500 text-white ' 
                : 'hover:bg-blue-500'}`}
            >
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
      </div>
    </div>
  );
};


/*
Sección de Ajustes
      <div className="mt-auto">
        <Link
          to="/ajustes"
          className={`flex items-center p-2 rounded-lg transition-colors
            ${location.pathname === '/ajustes' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
        >
          <span className="mr-2 text-xl">⚙️</span>
          <span>Ajustes</span>
        </Link>
      </div>

*/