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
    
    <div className="relative w-auto ">
      <input
        type="text"
        placeholder={placeholder}
        className="w-[558px] h-9 pl-4 pb-1 
        placeholder:font-medium placeholder:font-Lato placeholder:text-base placeholder:text-gray1
        border border-gray2
        rounded-2xl 
        focus:outline-none focus:ring-2 focus:border-0 focus:ring-blue-500"
      />
    </div>
  );
}