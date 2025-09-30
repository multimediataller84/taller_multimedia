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
  confirmLabel = "Sí",
  cancelLabel = "No",
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-6 w-[360px] shadow-xl">
        <h3 className="font-Lato text-lg mb-2">{title}</h3>
        {message && <p className="text-sm text-gray-700 mb-4">{message}</p>}

        <div className="flex justify-end gap-3">
          {}
          <button
            type="button"
            onClick={onCancel}
            className="w-[94px] py-2 rounded-3xl bg-[#FF4747] border border-[#FF4747] hover:bg-[#D32626] text-white font-Lato font-bold transition duration-300"
          >
            {cancelLabel}
          </button>

          {}
          <button
            type="button"
            onClick={onConfirm}
            className="w-[94px] py-2 rounded-3xl bg-blue-500 border border-blue-500 text-white font-Lato font-bold transition duration-300 hover:bg-blue-800 hover:border-blue-800"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
