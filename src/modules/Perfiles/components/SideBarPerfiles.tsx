// Sidebar.tsx
import { useNavigate } from 'react-router-dom';

export const SidebarPerfiles = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    // Aquí iría tu lógica de cierre de sesión
    console.log("Cerrar sesión");
  };

  return (
    <div className="w-64 bg-gray-50 shadow-md p-4 flex flex-col justify-between h-screen">
      {/* LOGO */}
      <div className="flex flex-col items-center">
        <span className="text-blue-500 text-lg font-bold">LOGO</span>
      </div>

      {/* Botón Regresar */}
      <div className="mt-8">
        <button
          onClick={handleBack}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full"
        >
          <span className="mr-2">←</span>
          <span>Regresar</span>
        </button>
      </div>

      {/* Cerrar sesión */}
      <div className="mt-auto flex items-center text-red-500 cursor-pointer hover:text-red-600" onClick={handleLogout}>
        <span className="mr-2">⎋</span>
        <span>Cerrar sesión</span>
      </div>
    </div>
  );
};
