// Sidebar.tsx
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', icon: '🏠', path: '/dashboard' },
  { name: 'Facturas', icon: '📄', path: '/facturas' },
  { name: 'Clientes', icon: '👥', path: '/clientes' },
  { name: 'Inventario', icon: '📦', path: '/products' },
  { name: 'Impuestos', icon: '💰', path: '/impuestos' },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white shadow-md p-4 flex flex-col justify-between h-screen">
      {/* Sección superior de navegación */}
      <div>
        <div className="flex items-center space-x-2 p-4">
          <span className="text-xl font-bold">LOGO</span>
        </div>
        <nav className="mt-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center p-2 rounded-lg transition-colors
                ${location.pathname === item.path ? 'bg-blue-500 text-white' : 'hover:bg-blue-500'}`}
            >
              <span className="mr-2 text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Sección inferior de "Ajustes" */}
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
    </div>
  );
};