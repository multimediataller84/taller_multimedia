import { useState } from "react";
import { TCustomerEndpoint } from "../../ClientsModule/models/types/TCustomerEndpoint";

interface Props {
  query: string;
  setQuery: (q: string) => void;
  filteredClients: TCustomerEndpoint[];
  onSelect: (c: TCustomerEndpoint) => void;
  disabled?: boolean;
}

export const ClientSelector: React.FC<Props> = ({ query, setQuery, filteredClients, onSelect, disabled = false }) => {
  const [open, setOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    setQuery(e.target.value);
    setOpen(true);
  };

  const handleSelect = (c: TCustomerEndpoint) => {
    if (disabled) return;
    onSelect(c);
    setOpen(false);
  };

  const handleFocus = () => {
    if (disabled) return;
    setOpen(true);
  };

  const handleBlur = () => {
    if (disabled) return;
    setTimeout(() => setOpen(false), 100);
  };

  return (
    <div className="relative">
      <input
        className={`w-full py-2 sm:py-2.5 border rounded-3xl px-3 sm:px-4 text-gray1 border-gray2 bg-white font-medium text-sm sm:text-base focus:outline-2 focus:outline-blue-500 font-Lato " ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
        placeholder="Buscar cliente"
        value={query}
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
      />
      {open && filteredClients.length > 0 && query && !disabled && (
        <ul className="absolute z-10 mt-1 w-full max-h-56 overflow-auto bg-white border rounded-md shadow">
          {filteredClients.map((c) => (
            <li
              key={c.id}
              className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(c)}
            >
              {c.name} {c.last_name} · {c.id_number}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
