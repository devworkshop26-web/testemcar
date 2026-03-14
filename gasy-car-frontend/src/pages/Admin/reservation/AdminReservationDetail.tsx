import { useParams } from "react-router-dom";
import {
  useReservationQuery,
  useReservationTransitionMutation,
  useUpdateReservationPaymentMutation,
} from "@/useQuery/reservationsUseQuery";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ReservationDetailPro } from "@/components/reservation/ReservationDetailPro";

const AdminReservationDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: reservation, isLoading } = useReservationQuery(id);
  const transitionMutation = useReservationTransitionMutation();
  const paymentMutation = useUpdateReservationPaymentMutation();

  const paymentStatus = reservation?.payment?.status;
  const hasPayment = !!reservation?.payment;
  const isPaymentPending = paymentStatus === "PENDING";
  const isPaymentValidated = paymentStatus === "VALIDATED";
  const isPaymentRejected = paymentStatus === "REJECTED";

  const handleTransition = (
    action: "cancel" | "start" | "complete",
    successMessage: string
  ) => {
    if (!reservation) return;

    transitionMutation.mutate(
      { id: reservation.id, action },
      {
        onSuccess: () => {
          toast({
            title: "Statut mis à jour",
            description: successMessage,
          });
        },
        onError: (error: any) => {
          toast({
            title: "Erreur",
            description:
              error?.response?.data?.detail ||
              "Impossible de mettre à jour le statut.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handlePaymentStatus = (
    status: "VALIDATED" | "REJECTED",
    successMessage: string
  ) => {
    if (!reservation?.payment?.id) return;

    paymentMutation.mutate(
      {
        id: reservation.payment.id,
        payload: { status },
      },
      {
        onSuccess: () => {
          toast({
            title: "Paiement mis à jour",
            description: successMessage,
          });
        },
        onError: (error: any) => {
          toast({
            title: "Erreur",
            description:
              error?.response?.data?.detail ||
              "Impossible de mettre à jour le paiement.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const alerts = (
    <>
      {reservation?.status === "PENDING" && !hasPayment && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">
          Aucun paiement n’a encore été soumis pour cette réservation.
        </div>
      )}

      {reservation?.status === "PENDING" && hasPayment && isPaymentPending && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
          Le paiement est en attente de validation par l’administrateur ou le support.
        </div>
      )}

      {reservation?.status === "PENDING" && isPaymentValidated && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          Paiement validé. La réservation est maintenant en attente de confirmation par le prestataire.
        </div>
      )}

      {reservation?.status === "PENDING" && isPaymentRejected && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Le paiement a été rejeté. Le client devra soumettre une nouvelle preuve.
        </div>
      )}
    </>
  );

  const adminActions = reservation && (
    <>
      {reservation.status === "PENDING" && reservation.payment && isPaymentPending && (
        <>
          <Button
            variant="default"
            onClick={() =>
              handlePaymentStatus("VALIDATED", "Le paiement a été validé.")
            }
            disabled={paymentMutation.isPending}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {paymentMutation.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Valider le paiement
          </Button>

          <Button
            variant="destructive"
            onClick={() =>
              handlePaymentStatus("REJECTED", "Le paiement a été rejeté.")
            }
            disabled={paymentMutation.isPending}
          >
            {paymentMutation.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Rejeter le paiement
          </Button>
        </>
      )}

      {reservation.status === "PENDING" && (
        <Button
          variant="outline"
          onClick={() =>
            handleTransition("cancel", "La réservation a été annulée.")
          }
          disabled={transitionMutation.isPending}
        >
          {transitionMutation.isPending && (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          )}
          Annuler la réservation
        </Button>
      )}

      {reservation.status === "CONFIRMED" && (
        <>
          <Button
            variant="default"
            onClick={() =>
              handleTransition("start", "La réservation est maintenant en cours.")
            }
            disabled={transitionMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {transitionMutation.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Démarrer
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              handleTransition("cancel", "La réservation a été annulée.")
            }
            disabled={transitionMutation.isPending}
          >
            Annuler
          </Button>
        </>
      )}

      {reservation.status === "IN_PROGRESS" && (
        <Button
          variant="default"
          onClick={() =>
            handleTransition("complete", "La réservation a été terminée.")
          }
          disabled={transitionMutation.isPending}
          className="bg-slate-900 hover:bg-slate-800 text-white"
        >
          {transitionMutation.isPending && (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          )}
          Marquer comme terminée
        </Button>
      )}
    </>
  );

  return (
    <ReservationDetailPro
      reservation={reservation}
      isLoading={isLoading}
      backUrl="/admin/reservations"
      actions={adminActions}
      alerts={alerts}
    />
  );
};

export default AdminReservationDetail;