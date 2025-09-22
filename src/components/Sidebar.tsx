import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', icon: '', path: '/dashboard' },
  { name: 'Facturas', icon: '', path: '/facturas' },
  { name: 'Clientes', icon: '', path: '/clients' },
  { name: 'Inventario', icon: '', path: '/product' },
  { name: 'Impuestos', icon: '', path: '/impuestos' }
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-[15%] bg-white flex flex-col justify-between h-screen" >
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

