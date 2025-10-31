import { useUploader } from "../hooks/useUploader";

export default function TaxExcelUploader() {
  const { inputRef, file, busy, msg, handleSelect, handleUpload } = useUploader();

  return (

    <div className="flex items-center space-x-4">
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleSelect}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:px-5 text-xs sm:text-sm md:text-base font-Lato font-bold transition duration-300 bg-black text-white border-black hover:bg-gray-700 hover:border-gray-700"
      >
        Seleccionar archivo
      </button>

      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || busy}
        className="py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:px-5 text-xs sm:text-sm md:text-base font-Lato font-bold transition duration-300 bg-blue-500 text-white border-blue-500 hover:bg-blue-800 hover:border-blue-800"
      >
        {busy ? "Subiendo..." : "Subir Excel"}
      </button>

      <span className="font-Lato font-medium text-xs sm:text-sm md:text-base text-gray1 pl-2 pt-2 sm:pl-0 sm:pt-0">{file ? file.name : "Ningún archivo seleccionado"}</span>
      {msg && <span className="font-Lato font-medium text-xs sm:text-sm md:text-base text-gray1 pl-2 pt-2 sm:pl-0 sm:pt-0">{msg}</span>}
    </div>
  );
}