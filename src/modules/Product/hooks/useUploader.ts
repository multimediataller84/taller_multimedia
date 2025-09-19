import { useRef, useState } from "react";
import { postProcessExcel } from "../../../shared/services/processDataService";

export function useUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
    setMsg(null);
  };

  const handleUpload = async () => {
    const f = file ?? inputRef.current?.files?.[0];
    if (!f) return setMsg("Primero selecciona un archivo");

    setBusy(true);
    setMsg(null);

    try {
      console.log("Archivo a enviar:", f);
      const fd = new FormData();
      fd.append("file", f);
      for (const [key, value] of fd.entries()) console.log(key, value);

      await postProcessExcel(f);
      setMsg("Archivo enviado correctamente");

      if (inputRef.current) inputRef.current.value = "";
      setFile(null);
    } catch (err: any) {
      console.error(err);
      setMsg(err.message || "Error al subir el archivo");
    } finally {
      setBusy(false);
    }
  };

  return { inputRef, file, busy, msg, handleSelect, handleUpload };
}
