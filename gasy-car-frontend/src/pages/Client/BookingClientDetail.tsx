import { useParams } from "react-router-dom";
import {
  useReservationQuery,
  useReservationTransitionMutation,
} from "@/useQuery/reservationsUseQuery";
import { ReservationDetailPro } from "@/components/reservation/ReservationDetailPro";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const BookingClientDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: reservation, isLoading } = useReservationQuery(id);
  const transitionMutation = useReservationTransitionMutation();

  const handleCancelReservation = () => {
    if (!reservation) return;

    transitionMutation.mutate(
      {
        id: reservation.id,
        action: "cancel",
      },
      {
        onSuccess: () => {
          toast({
            title: "Réservation annulée",
            description: "Votre réservation a été annulée avec succès.",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Erreur",
            description:
              error?.response?.data?.detail ||
              "Impossible d’annuler la réservation.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const actions =
    reservation &&
    (reservation.status === "PENDING" || reservation.status === "CONFIRMED") ? (
      <Button
        variant="destructive"
        onClick={handleCancelReservation}
        disabled={transitionMutation.isPending}
      >
        {transitionMutation.isPending && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        Annuler la réservation
      </Button>
    ) : null;

  return (
    <ReservationDetailPro
      reservation={reservation}
      isLoading={isLoading}
      backUrl="/client/booking"
      actions={actions}
    />
  );
};

export default BookingClientDetail;