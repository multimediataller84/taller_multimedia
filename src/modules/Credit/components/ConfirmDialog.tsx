type Props = {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title = "Estás seguro?",
  message = "",
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/50" onClick={onCancel}></div>

      <div className="relative z-100 bg-gray3 rounded-2xl shadow-lg w-[60%] sm:w-[70%] md:w-[50%] lg:w-1/3 2xl:w-1/4 p-6 max-h-[90vh] overflow-y-auto space-y-4">
        <h3 className="text-base sm:text-xl font-semibold">{title}</h3>
        {message && <p className="text-sm sm:text-base ">{message}</p>}

        <div className="flex justify-end gap-3">
          {}
          <button
            type="button"
            onClick={onConfirm}
              className="py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px] text-xs sm:text-sm md:text-base bg-blue-500 border border-blue-500 text-white font-Lato font-bold transition duration-300 hover:bg-blue-800 hover:border-blue-800 disabled:opacity-60"
          >
            {confirmLabel}
          </button>

          {}
          <button
            type="button"
            onClick={onCancel}
              className="py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato font-bold bg-black border-black text-white hover:bg-gray-700 hover:border-gray-700 transition duration-300"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
