import { useEffect } from "react";

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
  onClose,
}: Props) {
  if (!open) return null;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer); // limpia el timeout si se desmonta antes
  }, [onClose]);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      <div className="relative z-100 bg-gray3 rounded-2xl shadow-lg w-[60%] sm:w-[70%] md:w-[50%] lg:w-1/3 2xl:w-1/4 p-6 max-h-[90vh] overflow-y-auto space-y-4">
        <div className="h-full items-center flex-col flex justify-center w-full">
                <div className="w-full justify-center flex mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-12 stroke-blue-500">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
          <h2 className="text-base sm:text-xl font-semibold">{title}</h2>
          <p className="text-sm sm:text-base ">{message}</p>
        </div>
      </div>

    </div>
  );
}
