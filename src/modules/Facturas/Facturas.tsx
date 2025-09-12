import { useForm } from "react-hook-form";
import { useState } from "react";
import { Sidebar } from "./../Product/components/Sidebar";
import { useNavigate } from 'react-router-dom';
import { SearchBar } from "./../Product/components/SearchBar";

type InvoiceForm = {
  nombreCliente: string;
  cedula: string;
  producto: string;
  cantidad: number;
  descuento: number;
  ivi: number;
};

export const Invoice = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InvoiceForm>();

  const [total, setTotal] = useState(0);

  const onSubmit = (data: InvoiceForm) => {
    const subtotal = data.cantidad * 99.99;
    const descuento = data.descuento || 0;
    const impuesto = data.ivi || 0;

    const totalCalculado = subtotal - descuento + impuesto;
    setTotal(totalCalculado);
  };

  const searchProducts = (query: string) => {
    // Aquí puedes implementar lógica de búsqueda si deseas
  };

  const handleSearch = (query: string) => {
    searchProducts(query);
  };

  return (
    <div className="flex bg-[#DEE8ED] min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1">
        {/* SearchBar y header */}
        <div className="bg-white p-4 flex justify-between items-center shadow-md">
          <SearchBar onSearch={handleSearch} placeholder="Buscar productos..." />
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-xl">🔔</span>
            <span
  className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-1 rounded"
  onClick={() => navigate('/perfiles')}
>
  <span className="w-8 h-8 rounded-full bg-gray-300"></span>
  Administrador
</span>
          </div>
        </div>

        {/* Contenido de facturación */}
        <div className="p-8 flex">
          <main className="flex-1 pr-6">
            <h1 className="text-2xl font-semibold mb-6">Facturación</h1>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-2 gap-4 max-w-3xl mb-6"
            >
              <div>
                <label className="block mb-1 font-medium">Nombre del cliente</label>
                <input
                  {...register("nombreCliente", { required: true })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Nombre del cliente"
                />
                {errors.nombreCliente && (
                  <p className="text-red-500 text-sm">Este campo es requerido</p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">Cédula</label>
                <input
                  {...register("cedula", { required: true })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Cédula"
                />
                {errors.cedula && (
                  <p className="text-red-500 text-sm">Este campo es requerido</p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">Producto</label>
                <input
                  {...register("producto", { required: true })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Producto"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Cantidad</label>
                <input
                  type="number"
                  {...register("cantidad", { required: true, min: 1 })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Cantidad"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Descuento</label>
                <input
                  type="number"
                  {...register("descuento")}
                  className="w-full border rounded px-3 py-2"
                  placeholder="₡0.00"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">I.V.I</label>
                <input
                  type="number"
                  {...register("ivi")}
                  className="w-full border rounded px-3 py-2"
                  placeholder="₡0.00"
                />
              </div>
            </form>

            {/* Total & Button */}
            <div className="flex items-center gap-4 mb-8">
              <p className="text-xl font-semibold">Total: ₡{total.toFixed(2)}</p>
              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded flex items-center"
              >
                Realizar factura
              </button>
            </div>

            {/* Firma Digital */}
            <div className="border-dashed border-2 border-gray-400 h-32 flex justify-center items-center text-gray-500 text-xl rounded mb-8">
              Firma Digital
            </div>
          </main>

          {/* Invoice Summary */}
          <aside className="w-96 p-6 border-l bg-white">
            <h2 className="text-lg font-semibold mb-4">Resumen de factura</h2>
            <div className="border p-4 text-sm">
              <p>
                <strong>Invoice #:</strong> INV-2024-001
              </p>
              <p>
                <strong>Date:</strong> July 26, 2024
              </p>
              <p>
                <strong>Due Date:</strong> August 25, 2024
              </p>
              <p>
                <strong>Status:</strong> Draft
              </p>

              <hr className="my-2" />

              <p>
                <strong>Customer</strong>
              </p>
              <p>Olivia Bennett</p>
              <p>olivia.bennett@example.com</p>
              <p>+1 (555) 123-4567</p>

              <hr className="my-2" />

              <p>
                <strong>Product</strong>
              </p>
              <p>Premium Subscription</p>
              <p>Access to all features</p>

              <hr className="my-2" />

              <p>
                <strong>Total</strong>
              </p>
              <p>Subtotal: $99.99</p>
              <p>Discount: $0.00</p>
              <p>Tax: $0.00</p>
              <p className="font-bold mt-2">Grand Total: $99.99</p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-4 text-sm text-gray-600">
              <button className="flex items-center gap-1 hover:text-black">
                ⬇ Descargar
              </button>
              <button className="flex items-center gap-1 hover:text-black">
                🖨 Imprimir
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
