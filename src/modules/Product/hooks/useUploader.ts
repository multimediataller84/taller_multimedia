import { useRef, useState } from "react";

export function useUploader(onUpload: (file: File) => Promise<void> | void) {
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
      await onUpload(f);
      setMsg("Archivo enviado");
      if (inputRef.current) inputRef.current.value = "";
      setFile(null);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error al subir el archivo");
    } finally {
      setBusy(false);
    }
  };

  return {
    inputRef,
    file,
    busy,
    msg,
    handleSelect,
    handleUpload,
  };
}
