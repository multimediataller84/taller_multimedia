import { useState } from "react";
import { TCustomerEndpoint } from "../../ClientsModule/models/types/TCustomerEndpoint";

interface Props {
  query: string;
  setQuery: (q: string) => void;
  filteredClients: TCustomerEndpoint[];
  onSelect: (c: TCustomerEndpoint) => void;
}

export const ClientSelector: React.FC<Props> = ({ query, setQuery, filteredClients, onSelect }) => {
  const [open, setOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setOpen(true);
  };

  const handleSelect = (c: TCustomerEndpoint) => {
    onSelect(c);
    setOpen(false);
  };

  return (
    <div className="relative">
      <input
        className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Buscar cliente"
        value={query}
        onFocus={() => setOpen(true)}
        onChange={handleChange}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
      />
      {open && filteredClients.length > 0 && query && (
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
