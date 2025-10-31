type Props = {
  onDelete: () => void;
};

export default function CreditActions({ onDelete }: Props) {
  return (
      <button
        type="button"
        onClick={onDelete}
        className="py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto text-xs sm:text-sm md:text-base font-Lato font-bold transition duration-300 bg-black border border-black hover:bg-red-800 hover:border-red-800 text-white"
      >
        Eliminar Credito
      </button>
  );
}
