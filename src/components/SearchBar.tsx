import { useEffect, useState } from "react";

type Props = {
  placeholder?: string;

  value?: string;

  onChange?: (value: string) => void;
  className?: string;

  showBell?: boolean;
  onBellClick?: () => void;

  username?: string;
  avatarUrl?: string;

  /** Campo para acciones a la derecha (opcional) */
  rightSlot?: React.ReactNode;

  inputAriaLabel?: string;
};

export default function SearchBar({
  placeholder = "Buscar...",
  value,
  onChange,
  className = "",
  showBell = true,
  onBellClick,
  username = "Administrador",
  avatarUrl,
  rightSlot,
  inputAriaLabel,
}: Props) {
  const [local, setLocal] = useState(value ?? "");
  useEffect(() => {
    if (value !== undefined) setLocal(value);
  }, [value]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setLocal(v);
    onChange?.(v);
  };

  return (
    <div className={`h-16 border-b bg-white flex items-center justify-between px-4 ${className}`}>
      <div className="flex-1 max-w-3xl">
        <label className="relative block">
          <span className="absolute left-3 top-2.5 select-none" aria-hidden>
            🔎
          </span>
          <input
            aria-label={inputAriaLabel ?? placeholder}
            className="w-full rounded-full border px-10 py-2 text-sm placeholder:text-gray-400"
            placeholder={placeholder}
            value={local}
            onChange={handleInput}
          />
        </label>
      </div>

      <div className="flex items-center gap-4">
        {/* Acciones extra opcionales */}
        {rightSlot}

        {showBell && (
          <button
            type="button"
            onClick={onBellClick}
            className="h-9 w-9 grid place-items-center rounded-full hover:bg-gray-100"
            aria-label="Notificaciones"
            title="Notificaciones"
          >
            🔔
          </button>
        )}

        <div className="flex items-center gap-2">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <div className="h-9 w-9 rounded-full bg-gray-300" />
          )}
          <span className="text-sm text-gray-700">{username}</span>
        </div>
      </div>
    </div>
  );
}