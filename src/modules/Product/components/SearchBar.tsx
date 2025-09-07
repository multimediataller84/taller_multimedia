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
    <div className="relative w-auto ">
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        className="w-[558px] h-9 pl-4 pb-1 
        placeholder:font-medium placeholder:font-Lato placeholder:text-base placeholder:text-gray1
        border border-gray2
        rounded-2xl 
        focus:outline-none focus:ring-2 focus:border-0 focus:ring-blue-500"
      />
    </div>
  );
};