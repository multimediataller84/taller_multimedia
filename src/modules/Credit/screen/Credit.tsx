import type { TCustomerEndpoint } from "../../ClientsModule/models/types/TCustomerEndpoint";
import { useMemo, useState } from "react";
import { useCredit } from "../hooks/useCredit";
import CreditAssignForm from "../components/CreditAssignForm";
import CreditBalance from "../components/CreditBalance";
import CreditActions from "../components/CreditActions";
import PaymentModal from "../components/PaymentModal";
import InvoiceModal from "../components/InvoiceModal";
import ConfirmDialog from "../components/ConfirmDialog";
import InvoiceCard from "../components/InvoiceCard";
import PaymentCard from "../components/PaymentCard";
import { formatCRC } from "../utils/currency";

type Props = { client: TCustomerEndpoint | null };

export default function CreditScreen({ client }: Props) {
  const clientId = client?.id ?? null;
  const clientName = client ? `${client.name} ${client.last_name}` : "";
  const {
    credit,
    hasCredit,
    create,
    addInvoice,
    removeInvoice,
    payInvoice,
    removePayment,
    cancelInvoice,
    removeCredit,
    loading,
    errorMsg,
  } = useCredit(clientId);

  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);

  const [confirmDeleteCreditOpen, setConfirmDeleteCreditOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);
  const [invoiceToCancel, setInvoiceToCancel] = useState<string | null>(null);
  const [invoiceForPayment, setInvoiceForPayment] = useState<string | null>(null);

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

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

  if (!clientId) {
    return <div className="p-8">Seleccione un cliente para gestionar su crédito.</div>;
  }

  if (loading) {
    return <div className="p-8">Cargando...</div>;
  }

  if (!hasCredit) {
    return (
      <CreditAssignForm
        clientName={clientName}
        onCreate={(amount) => create(amount)}
      />
    );
  }

  return (
    <div className="flex flex-col">
      
      <div className="flex items-center justify-between p-8">
        <div className="flex flex-col gap-2">
          <CreditBalance credit={credit!} />
          {errorMsg && <span className="text-red-600 text-sm">{errorMsg}</span>}
          
          <button
            type="button"
            onClick={() => setInvoiceOpen(true)}
            className="w-[160px] h-[34px] rounded-3xl bg-white border border-blue-500 text-blue-500 font-Lato font-bold transition duration-300 hover:bg-blue-500 hover:text-white"
          >
            Agregar factura
          </button>
          <span className="text-xs text-gray-600">
            Disponible: {formatCRC(credit!.remaining)}
          </span>
        </div>

        <CreditActions
          onDelete={() => setConfirmDeleteCreditOpen(true)}
        />
      </div>

      <div className="grid grid-cols-3 gap-6 px-8 pb-8">
        
        <div className="col-span-2 flex flex-col gap-3">
          {(credit?.invoices?.length ?? 0) === 0 ? (
            <div className="text-gray-600">Aún no hay facturas agregadas.</div>
          ) : (
            (credit?.invoices ?? []).map(inv => (
              <InvoiceCard
                key={inv.id}
                amount={inv.amount}
                dueRemaining={inv.dueRemaining}
                createdAt={inv.createdAt}
                locked={!!inv.locked}
                selected={selectedInvoiceId === inv.id}
                onSelect={() => setSelectedInvoiceId(prev => (prev === inv.id ? null : inv.id))}
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

        <div className="col-span-1 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="font-Lato font-semibold">Abonos</h4>
            {selectedInvoice && (
              <button
                type="button"
                onClick={() => setSelectedInvoiceId(null)}
                className="text-blue-600 underline"
                title="Quitar filtro"
              >
                Quitar filtro
              </button>
            )}
          </div>

          {filteredPayments.length === 0 ? (
            <div className="text-gray-600">
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
                onDelete={() => setPaymentToDelete(paym.id)}
              />
            ))
          )}
        </div>
      </div>

      <InvoiceModal
        open={invoiceOpen}
        maxAmount={credit!.remaining}
        onClose={() => setInvoiceOpen(false)}
        onConfirm={(amount) => {
          const res = addInvoice(amount);
          if (res.ok) setInvoiceOpen(false);
        }}
      />

      <PaymentModal
        open={payOpen}
        title="Abonar a factura"
        maxAmount={maxPayForActive}
        onClose={() => {
          setPayOpen(false);
          setInvoiceForPayment(null);
        }}
        onConfirm={(amount) => {
          if (!invoiceForPayment) return;
          const res = payInvoice(invoiceForPayment, amount);
          if (res.ok) {
            setPayOpen(false);
            setInvoiceForPayment(null);
          }
        }}
      />

      <ConfirmDialog
        open={!!invoiceToCancel}
        onCancel={() => setInvoiceToCancel(null)}
        onConfirm={() => {
          if (invoiceToCancel) cancelInvoice(invoiceToCancel);
          setInvoiceToCancel(null);
        }}
        title="¿Estás seguro?"
        message="Se abonará automáticamente lo faltante de esta factura, se saldará y quedará bloqueada."
        confirmLabel="Sí"
        cancelLabel="No"
      />

      <ConfirmDialog
        open={confirmDeleteCreditOpen}
        onCancel={() => setConfirmDeleteCreditOpen(false)}
        onConfirm={() => {
          removeCredit();
          setConfirmDeleteCreditOpen(false);
        }}
        title="¿Estás seguro?"
        message="Esto eliminará el crédito del cliente y su historial."
        confirmLabel="Sí"
        cancelLabel="No"
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
        confirmLabel="Sí"
        cancelLabel="No"
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
        confirmLabel="Sí"
        cancelLabel="No"
      />
    </div>
  );
}
