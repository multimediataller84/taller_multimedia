import React from "react";

type AlertType = "success" | "error" | "info" | "confirmation";

interface Props {
  open: boolean;
  title: string;
  message: string;
  type?: AlertType;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

const iconByType: Record<AlertType, React.ReactNode> = {
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12 stroke-blue-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12 stroke-red-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 3h.007M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12 stroke-blue-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.018.852l-.47 1.884a1.5 1.5 0 0 0 .364 1.42l.01.01a1.5 1.5 0 0 0 2.12 0l.53-.53M12 6.75h.008v.008H12V6.75zM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  confirmation: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12 stroke-yellow-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 3h.007M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
};

export const AlertModal: React.FC<Props> = ({
  open,
  title,
  message,
  type = "info",
  onClose,
  onConfirm,
  confirmText = "Sí",
  cancelText = "No",
  showCancel = true
}) => {
  if (!open) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const isConfirmation = type === "confirmation";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-auto max-w-md -translate-y-20 px-8 py-6 items-center rounded-2xl shadow">
        <div className="h-full items-center flex-col flex justify-center w-full">
          <div className="w-full justify-center flex mb-2">
            {iconByType[type]}
          </div>
          <h2 className="w-full text-2xl font-Lato font-medium text-center">{title}</h2>
          <p className="w-full mt-1 text-base text-gray-700 text-center">{message}</p>

          <div className={`mt-5 flex gap-3 ${isConfirmation ? 'justify-center' : 'justify-center'}`}>
            {isConfirmation ? (
              <>
                {showCancel && (
                  <button
                    className="px-5 py-2 rounded-3xl bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
                    onClick={onClose}
                  >
                    {cancelText}
                  </button>
                )}
                <button
                  className="px-5 py-2 rounded-3xl bg-blue-500 text-white hover:bg-blue-700 transition"
                  onClick={handleConfirm}
                >
                  {confirmText}
                </button>
              </>
            ) : (
              <button
                className="px-5 py-2 rounded-3xl bg-blue-500 text-white hover:bg-blue-700 transition"
                onClick={onClose}
              >
                Aceptar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
