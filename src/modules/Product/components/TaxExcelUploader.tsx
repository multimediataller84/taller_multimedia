import { useUploader } from "../hooks/useUploader";

export default function TaxExcelUploader({
  onUpload,
}: {
  onUpload: (file: File) => Promise<void> | void;
}) {
  const { inputRef, file, busy, msg, handleSelect, handleUpload } =
    useUploader(onUpload);

  return (
    <div className="flex items-center gap-2">
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
        className="px-3 py-2 rounded border"
      >
        Seleccionar archivo
      </button>

      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || busy}
        className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
      >
        {busy ? "Subiendo..." : "Subir Excel"}
      </button>

      <span className="text-xs text-gray-600">
        {file ? file.name : "Ningún archivo seleccionado"}
      </span>

      {msg && <span className="text-xs text-gray-600 ml-2">{msg}</span>}
    </div>
  );
}