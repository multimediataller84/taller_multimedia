import React from "react";

type Status = "success" | "error";

type Props = {
  open: boolean;
  title: string;
  message: string;
  status: Status;
  onClose: () => void;
};

export default function CreditStatusModal({
  open,
  title,
  message,
  status,
  onClose,
}: Props) {
  if (!open) return null;

  const isSuccess = status === "success";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-3 flex items-center gap-2">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full ${
              isSuccess ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <span className={`text-xl ${isSuccess ? "text-green-600" : "text-red-600"}`}>
              {isSuccess ? "✓" : "!"}
            </span>
          </div>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>

        <p className="mb-5 text-sm text-gray-700">{message}</p>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
