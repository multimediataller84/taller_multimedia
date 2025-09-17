import { useState } from "react";

export default function TaxExcelUploader({ onUpload }: { onUpload: (file: File) => Promise<void> | void }) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handle = async () => {
    if (!file) return;
    setBusy(true); setMsg(null);
    try {
      await onUpload(file);
      setMsg("Impuestos actualizados correctamente.");
      setFile(null);
    } catch (e: any) {
      setMsg(e?.message ?? "Error al actualizar impuestos.");
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input type="file" accept=".xlsx,.xls" onChange={e => setFile(e.target.files?.[0] ?? null)} />
      <button onClick={handle} disabled={!file || busy}
        className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50">
        {busy ? "Subiendo..." : "Actualizar impuestos (Excel)"}
      </button>
      {msg && <span className="text-xs text-gray-600 ml-2">{msg}</span>}
    </div>
  );
}