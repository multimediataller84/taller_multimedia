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
        className="w-[94px] py-2 rounded-3xl bg-[#FF4747] border border-[#FF4747] hover:bg-[#D32626] text-white font-Lato font-bold transition duration-300"
      >
        Eliminar
      </button>
    </div>
  );
}
