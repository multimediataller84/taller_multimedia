import { useRef, useState } from "react";

export default function TaxExcelUploader({
  onUpload,
}: { onUpload: (file: File) => Promise<void> | void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Abre el diálogo del sistema
  const openPicker = () => {
    inputRef.current?.click();
  };

  // Guarda el primer archivo (files[0]) en estado
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;     // <-- file = fileInput.files[0]
    setSelected(f);
    setMsg(null);
    // console.log("Seleccionado:", f?.name, f?.size);
  };

  // Sube el archivo seleccionado
  const handleUpload = async () => {
    const file = selected ?? inputRef.current?.files?.[0] ?? null;
    if (!file) { setMsg("Primero selecciona un archivo"); return; }

    setBusy(true); setMsg(null);
    try {
      await onUpload(file);                    // tu servicio hace FormData.append("file", file)
      setMsg("Archivo enviado ✅");
      // Limpia
      if (inputRef.current) inputRef.current.value = "";
      setSelected(null);
    } catch (e: any) {
      setMsg(e?.message ?? "Error al subir el archivo");
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* input oculto: no dependes del botón nativo del navegador */}
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={onChange}
        className="hidden"
      />

      {/* Botón para abrir el picker */}
      <button
        type="button"
        onClick={openPicker}
        className="px-3 py-2 rounded border"
      >
        Seleccionar archivo
      </button>

      {/* Botón de subida: se habilita SOLO si hay archivo */}
      <button
        type="button"
        onClick={handleUpload}
        disabled={!selected || busy}
        className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
      >
        {busy ? "Subiendo..." : "Subir Excel"}
      </button>

      <span className="text-xs text-gray-600">
        {selected ? selected.name : "Ningún archivo seleccionado"}
      </span>

      {msg && <span className="text-xs text-gray-600 ml-2">{msg}</span>}
    </div>
  );
}