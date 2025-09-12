import React, { useState } from 'react';
import { SidebarPerfiles } from '../../Perfiles/components/SideBarPerfiles';
import { SearchBar } from '../../Product/components/SearchBar';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useRegister from '../../Register/hooks/useRegister';

// TRegister requiere email, así que lo generamos automáticamente si no se pide en el modal
import { TRegister } from '../../Register/models/types/TRegister';

type PerfilManual = {
  name: string;
  last_name: string;
  username: string;
  password: string;
  password_confirmation: string;
  email?: string;
};

export const Perfiles = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const defaultPerfiles = [
    { nombre: 'Caja 1', status: 'Activo', rol: 'Usuario' },
    { nombre: 'Caja 2', status: 'Activo', rol: 'Usuario' },
    { nombre: 'Caja 3', status: 'Activo', rol: 'Usuario' },
    { nombre: 'Caja 4', status: 'Inactivo', rol: 'Usuario' },
    { nombre: 'Caja 5', status: 'Inactivo', rol: 'Usuario' },
  ];

  const [perfiles, setPerfiles] = useState(() => {
    const stored = localStorage.getItem('perfiles');
    return stored ? JSON.parse(stored) : defaultPerfiles;
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PerfilManual>();

  const { requestUser, loading, error } = useRegister();
  const password = watch('password');

  const onSubmit = async (data: PerfilManual) => {
    // Generar email dummy si no se pide en el modal (por ejemplo: username@dummy.local)
    const email = data.email ? data.email : `${data.username}@dummy.local`;
    const newUser: TRegister = {
      name: data.name,
      last_name: data.last_name,
      username: data.username,
      email,
      password: data.password,
      password_confirmation: data.password_confirmation,
    };
    await requestUser(newUser);
    const nuevosPerfiles = [
      ...perfiles,
      {
        nombre: data.name + ' ' + data.last_name,
        status: 'Activo',
        rol: 'Usuario',
      },
    ];
    setPerfiles(nuevosPerfiles);
    localStorage.setItem('perfiles', JSON.stringify(nuevosPerfiles));
    setShowModal(false);
    reset();
  };


  const searchProducts = (query: string) => {
    console.log('Buscando:', query);
  };

  const handleSearch = (query: string) => {
    searchProducts(query);
  };

  const handleDeletePerfil = (index: number) => {
    setPerfiles(prev => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem('perfiles', JSON.stringify(updated));
      return updated;
    });
  };


  return (
    <div className="flex bg-[#DEE8ED] h-screen">
      {/* Sidebar */}
      <SidebarPerfiles />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header con search bar y perfil */}
        <div className="bg-white p-4 flex justify-between items-center shadow-md">
          <SearchBar onSearch={handleSearch} placeholder="Buscar perfiles" />
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-xl">🔔</span>
            <span
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-1 rounded"
              onClick={() => navigate('/perfiles')}
            >
              <span className="w-8 h-8 rounded-full bg-gray-800"></span>
              <span>Administrador</span>
            </span>
          </div>
        </div>

        {/* Contenido de Perfiles */}
        <div className="p-6 bg-[#F3F3F3] flex-1 overflow-auto">
          {/* Título y botón */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Perfiles</h2>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setShowModal(true)}
            >
              + Nuevo perfil
            </button>
          </div>

          {/* Tabla */}
          <div className="bg-white shadow rounded overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border">Nombre</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Role</th>
                  <th className="p-3 border"></th>
                  <th className="p-3 border"></th>
                </tr>
              </thead>
              <tbody>
                {perfiles.map((perfil, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-3 border">{perfil.nombre}</td>
                    <td className="p-3 border">{perfil.status}</td>
                    <td className="p-3 border">{perfil.rol}</td>
                    <td className="p-3 border text-blue-600 cursor-pointer hover:underline">Editar</td>
                    <td
  className="p-3 border text-red-600 cursor-pointer hover:underline"
  onClick={() => handleDeletePerfil(index)}
>
  Eliminar
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-600">Mostrando 10 de 200 resultados</span>
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 border rounded hover:bg-gray-200">{'<'}</button>
              <button className="px-3 py-1 border rounded bg-gray-200">1</button>
              <button className="px-3 py-1 border rounded">2</button>
              <span className="px-2">...</span>
              <button className="px-3 py-1 border rounded">8</button>
              <button className="px-2 py-1 border rounded hover:bg-gray-200">{'>'}</button>
            </div>
          </div>
        {/* Modal para nuevo perfil */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4 text-center">Agregar Perfil Manualmente</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <label className="block text-gray-700 text-sm font-medium mb-2">Nombre</label>
                <input
                  type="text"
                  {...register('name', { required: 'Nombre requerido' })}
                  className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-xl py-2 px-3 text-gray-800 mb-2`}
                />
                {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name.message}</p>}

                <label className="block text-gray-700 text-sm font-medium mb-2">Apellido</label>
                <input
                  type="text"
                  {...register('last_name', { required: 'Apellido requerido' })}
                  className={`w-full border ${errors.last_name ? 'border-red-500' : 'border-gray-300'} rounded-xl py-2 px-3 text-gray-800 mb-2`}
                />
                {errors.last_name && <p className="text-red-500 text-sm mb-2">{errors.last_name.message}</p>}

                <label className="block text-gray-700 text-sm font-medium mb-2">Usuario</label>
                <input
                  type="text"
                  {...register('username', { required: 'Usuario requerido' })}
                  className={`w-full border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-xl py-2 px-3 text-gray-800 mb-2`}
                />
                {errors.username && <p className="text-red-500 text-sm mb-2">{errors.username.message}</p>}

                <label className="block text-gray-700 text-sm font-medium mb-2">Contraseña</label>
                <input
                  type="password"
                  {...register('password', { required: 'Contraseña requerida', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
                  className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl py-2 px-3 text-gray-800 mb-2`}
                />
                {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>}

                <label className="block text-gray-700 text-sm font-medium mb-2">Confirmar Contraseña</label>
                <input
                  type="password"
                  {...register('password_confirmation', {
                    required: 'Confirma la contraseña',
                    validate: (value) => value === password || 'Las contraseñas no coinciden',
                  })}
                  className={`w-full border ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'} rounded-xl py-2 px-3 text-gray-800 mb-2`}
                />
                {errors.password_confirmation && <p className="text-red-500 text-sm mb-2">{errors.password_confirmation.message}</p>}

                {loading ? (
                  <div className="w-full flex justify-center py-2">
                    <div className="w-6 h-6 border-2 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition duration-200 mt-2"
                  >
                    Guardar Perfil
                  </button>
                )}
                {error && <p className="text-red-500 text-sm mt-3">Error: {error}</p>}
              </form>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
