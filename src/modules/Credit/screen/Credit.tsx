import { useEffect, useMemo, useState } from "react";
import { useCredit } from "../hooks/useCredit";
import CreditAssignForm from "../components/CreditAssignForm";
import CreditBalance from "../components/CreditBalance";
import CreditActions from "../components/CreditActions";
import PaymentModal from "../components/PaymentModal";
import ConfirmDialog from "../components/ConfirmDialog";
import InvoiceCard from "../components/InvoiceCard";
import PaymentCard from "../components/PaymentCard";
import CreditStatusModal from "../components/CreditStatusModal";
import { formatCRC } from "../utils/currency";

type Props = {
  clientId: number;
  clientName?: string;
};

export default function Credit({ clientId, clientName = "" }: Props) {
  if (!clientId) {
    return <div className="p-8">Seleccione un cliente para gestionar su crédito.</div>;
  }

  const {
    credit,
    hasCredit,
    create,
    removeInvoice,
    payInvoice,
    removePayment,
    cancelInvoice,
    removeCredit,
    loading,
    errorMsg,
  } = useCredit(clientId);

  const [payOpen, setPayOpen] = useState(false);

  const [confirmDeleteCreditOpen, setConfirmDeleteCreditOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);
  const [invoiceToCancel, setInvoiceToCancel] = useState<string | null>(null);
  const [invoiceForPayment, setInvoiceForPayment] = useState<string | null>(null);

  const [statusModal, setStatusModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    status: "success" | "error";
  }>({ open: false, title: "", message: "", status: "success" });

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    setInvoiceToDelete(null);
    setPaymentToDelete(null);
    setInvoiceToCancel(null);
    setInvoiceForPayment(null);
    setSelectedInvoiceId(null);
  }, [clientId]);

  const selectedInvoice = useMemo(
    () => credit?.invoices.find(i => i.id === selectedInvoiceId) ?? null,
    [credit, selectedInvoiceId]
  );

  const activeInvoice = useMemo(
    () => credit?.invoices.find(i => i.id === invoiceForPayment) ?? null,
    [credit, invoiceForPayment]
  );

  const maxPayForActive = useMemo(() => {
    if (!activeInvoice || !credit) return 0;
    return Math.min(
      activeInvoice.dueRemaining,
      Math.max(0, credit.assigned - credit.remaining)
    );
  }, [activeInvoice, credit]);

  const filteredPayments = useMemo(() => {
    if (!credit) return [];
    if (!selectedInvoiceId) return credit.payments;
    return credit.payments.filter(p => p.invoiceId === selectedInvoiceId);
  }, [credit, selectedInvoiceId]);

  // Crear crédito -> modal éxito/error
  const handleCreate = (amount: number) => {
    (async () => {
      const res = await create(amount);
      if (res.ok) {
        setStatusModal({
          open: true,
          title: "Creación de crédito exitosa",
          message: "El crédito se creó correctamente.",
          status: "success",
        });
      } else {
        setStatusModal({
          open: true,
          title: "Error al crear el crédito",
          message: res.message || "No se pudo crear el crédito. Intenta de nuevo.",
          status: "error",
        });
      }
    })();
  };

  if (loading) {
    return <div className=" justify-center mt-50 flex">
      <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-blue-500"></div>
      </div>;
  }

  if (!hasCredit) {
    return (
      <>
        <CreditAssignForm
          clientName={clientName}
          onCreate={handleCreate}
        />
        <CreditStatusModal
          open={statusModal.open}
          title={statusModal.title}
          message={statusModal.message}
          status={statusModal.status}
          onClose={() => setStatusModal(s => ({ ...s, open: false }))}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* 🧾 Encabezado del crédito */}

      <div className="flex gap-4 flex-row items-center justify-between p-4 sm:p-6 md:p-8">
        <div className="flex flex-col w-[55%]">
          <CreditBalance credit={credit!} />
          {errorMsg && <span className="text-red-600 text-sm">{errorMsg}</span>}
          <span className="font-Lato text-xs md:text-base xl:text-base text-gray-600">
            Disponible: {formatCRC(credit!.remaining)}
          </span>
        </div>

        <div className="flex justify-end w-[45%] items-center">
          <CreditActions onDelete={() => setConfirmDeleteCreditOpen(true)} />
        </div>
      </div>

      {/* 📊 Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-6 md:px-8 pb-8">
        {/* Facturas */}
       
        <div className="lg:col-span-2 flex flex-col gap-3 overflow-y-auto h-60 2xl:h-90">
          {(credit?.invoices?.length ?? 0) === 0 ? (
            <div className="text-gray-600 text-sm sm:text-base">
              Aún no hay facturas agregadas.
            </div>
          ) : (
            (credit?.invoices ?? []).map(inv => (
              <InvoiceCard
                key={inv.id}
                amount={inv.amount}
                dueRemaining={inv.dueRemaining}
                createdAt={inv.createdAt}
                locked={!!inv.locked}
                selected={selectedInvoiceId === inv.id}
                onSelect={() =>
                  setSelectedInvoiceId(prev => (prev === inv.id ? null : inv.id))
                }
                onPay={() => {
                  setInvoiceForPayment(inv.id);
                  setPayOpen(true);
                }}
                onCancel={() => setInvoiceToCancel(inv.id)}
                onDelete={() => setInvoiceToDelete(inv.id)}
              />
            ))
          )}

        </div>

        {/* Abonos */}
        <div className="lg:col-span-1 flex flex-col gap-3">
          <div className="overflow-y-auto h-60 2xl:h-90 space-y-3">
          {filteredPayments.length === 0 ? (
            <div className="text-gray-600 text-sm sm:text-base">
              {selectedInvoice
                ? "No hay abonos para la factura seleccionada."
                : "Aún no hay abonos."}
            </div>
          ) : (
            filteredPayments.map(paym => (
              <PaymentCard
                key={paym.id}
                amount={paym.amount}
                createdAt={paym.createdAt}
                disabled={!!paym.locked}
                onDelete={() => setPaymentToDelete(String(paym.id))}
              />
            ))
          )}
          </div>
        </div>
      </div>

      {/* 🧩 Modales y diálogos */}
      <PaymentModal
        open={payOpen}
        title="Abonar a factura"
        maxAmount={maxPayForActive}
        onClose={() => {
          setPayOpen(false);
          setInvoiceForPayment(null);
        }}
        onConfirm={amount => {
          if (!invoiceForPayment) return;
          const res = payInvoice(invoiceForPayment, amount);
          if (res.ok) {
            setPayOpen(false);
            setInvoiceForPayment(null);
          }
        }}
      />

      <CreditStatusModal
        open={statusModal.open}
        title={statusModal.title}
        message={statusModal.message}
        status={statusModal.status}
        onClose={() => setStatusModal(s => ({ ...s, open: false }))}
      />

      {/* Confirmaciones */}
      <ConfirmDialog
        open={!!invoiceToCancel}
        onCancel={() => setInvoiceToCancel(null)}
        onConfirm={() => {
          if (invoiceToCancel) cancelInvoice(invoiceToCancel);
          setInvoiceToCancel(null);
        }}
        title="¿Estás seguro?"
        message="Se abonará automáticamente lo faltante de esta factura, se saldará y quedará bloqueada."
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
      />

      <ConfirmDialog
        open={confirmDeleteCreditOpen}
        onCancel={() => setConfirmDeleteCreditOpen(false)}
        onConfirm={async () => {
          const res = await removeCredit();
          setConfirmDeleteCreditOpen(false);

          setStatusModal({
            open: true,
            title: res.ok ? "Crédito eliminado" : "No se pudo eliminar",
            message: res.ok
              ? "El crédito del cliente se eliminó correctamente."
              : res.message || "Ocurrió un problema al eliminar el crédito.",
            status: res.ok ? "success" : "error",
          });
        }}
        title="¿Estás seguro?"
        message="Esto eliminará el crédito del cliente y su historial."
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
      />

      <ConfirmDialog
        open={!!invoiceToDelete}
        onCancel={() => setInvoiceToDelete(null)}
        onConfirm={() => {
          if (invoiceToDelete) removeInvoice(invoiceToDelete);
          setInvoiceToDelete(null);
        }}
        title="¿Estás seguro?"
        message="Esto eliminará la factura y ajustará el saldo disponible."
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
      />

      <ConfirmDialog
        open={!!paymentToDelete}
        onCancel={() => setPaymentToDelete(null)}
        onConfirm={() => {
          if (paymentToDelete) removePayment(paymentToDelete);
          setPaymentToDelete(null);
        }}
        title="¿Estás seguro?"
        message="Esto eliminará el abono y reajustará la deuda de su factura."
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
      />
    </div>
  );
}


/*
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h4 className="font-Lato font-semibold text-base sm:text-lg">Abonos</h4>
            {selectedInvoice && (
              <button
                type="button"
                onClick={() => setSelectedInvoiceId(null)}
                className="text-blue-600 underline text-sm"
              >
                Quitar filtro
              </button>
            )}
          </div>

*/