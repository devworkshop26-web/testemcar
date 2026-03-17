import { useParams } from "react-router-dom";
import {
  useReservationQuery,
  useReservationTransitionMutation,
} from "@/useQuery/reservationsUseQuery";
import { ReservationDetailPro } from "@/components/reservation/ReservationDetailPro";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const PrestataireReservationDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: reservation, isLoading } = useReservationQuery(id);
  const transitionMutation = useReservationTransitionMutation();

  const isPaymentValidated = reservation?.payment?.status === "VALIDATED";

  const handleTransition = (
    action: "accept" | "cancel" | "start" | "complete",
    successMessage: string
  ) => {
    if (!reservation) return;

    transitionMutation.mutate(
      {
        id: reservation.id,
        action,
      },
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

  const alerts =
    reservation?.status === "PENDING" && !isPaymentValidated ? (
      <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">
        Le paiement doit être validé par l’administrateur ou le support avant l’acceptation.
      </div>
    ) : null;

  const actions = reservation && (
    <>
      {reservation.status === "PENDING" && (
        <>
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() =>
              handleTransition("accept", "La réservation a été confirmée.")
            }
            disabled={transitionMutation.isPending || !isPaymentValidated}
          >
            {transitionMutation.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Accepter
          </Button>

          <Button
            variant="destructive"
            onClick={() =>
              handleTransition("cancel", "La réservation a été refusée.")
            }
            disabled={transitionMutation.isPending}
          >
            {transitionMutation.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Refuser
          </Button>
        </>
      )}

      {reservation.status === "CONFIRMED" && (
        <>
          <Button
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() =>
              handleTransition("start", "La réservation est maintenant en cours.")
            }
            disabled={transitionMutation.isPending}
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
            {transitionMutation.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Annuler
          </Button>
        </>
      )}

      {reservation.status === "IN_PROGRESS" && (
        <Button
          variant="default"
          className="bg-slate-900 hover:bg-slate-800 text-white"
          onClick={() =>
            handleTransition("complete", "La réservation a été terminée.")
          }
          disabled={transitionMutation.isPending}
        >
          {transitionMutation.isPending && (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          )}
          Terminer
        </Button>
      )}
    </>
  );

  return (
    <ReservationDetailPro
      reservation={reservation}
      isLoading={isLoading}
      backUrl="/prestataire/booking"
      actions={actions}
      alerts={alerts}
    />
  );
};

export default PrestataireReservationDetail;