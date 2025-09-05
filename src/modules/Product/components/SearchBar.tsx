import { ChangeEvent } from 'react';

type Props = {
  onSearch: (query: string) => void;
  placeholder: string;
};

export const SearchBar = ({ onSearch, placeholder }: Props) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
        🔍
      </span>
    </div>
  );
};