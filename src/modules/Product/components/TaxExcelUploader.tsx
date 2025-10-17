import { useUploader } from "../hooks/useUploader";

export default function TaxExcelUploader() {
  const { inputRef, file, busy, msg, handleSelect, handleUpload } = useUploader();

  return (

    <div className="flex  items-center space-x-4">
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
        className="rounded-3xl py-2 px-5 font-Lato text-base transition duration-300 border bg-black text-white border-black hover:bg-gray-700 hover:border-gray-700"
      >
        Seleccionar archivo
      </button>

      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || busy}
        className="w-auto border rounded-3xl py-2 px-5 font-Lato text-base mr-4 transition duration-300 bg-blue-500 text-white border-blue-500 hover:bg-blue-800 hover:border-blue-800"
      >
        {busy ? "Subiendo..." : "Subir Excel"}
      </button>

      <span className="text-base font-Lato text-gray1">{file ? file.name : "Ningún archivo seleccionado"}</span>
      {msg && <span className="text-base text-gray1 ml-2">{msg}</span>}
    </div>
  );
}