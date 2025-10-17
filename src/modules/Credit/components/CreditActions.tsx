type Props = {
  onDelete: () => void;
};

export default function CreditActions({ onDelete }: Props) {
  return (
    <div className="flex gap-3">
      {/*Elimina el crédito completamente*/}
      <button
        type="button"
        onClick={onDelete}
        className="w-[94px] py-2 rounded-3xl bg-black border border-black hover:bg-red-800 hover:border-red-800 text-white font-Lato font-bold transition duration-300"
      >
        Eliminar
      </button>
    </div>
  );
}
