import { useParams } from "react-router-dom";
import { useReservationQuery, useUpdateReservationMutation } from "@/useQuery/reservationsUseQuery";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ReservationDetailPro } from "@/components/reservation/ReservationDetailPro";

const AdminReservationDetail = () => {
    const { id } = useParams();
    const { toast } = useToast();

    const { data: reservation, isLoading } = useReservationQuery(id);
    const updateReservationMutation = useUpdateReservationMutation();

    const handleUpdateStatus = (status: "CONFIRMED" | "CANCELLED" | "COMPLETED") => {
        if (!reservation) return;

        updateReservationMutation.mutate(
            {
                id: reservation.id,
                payload: { status },
            },
            {
                onSuccess: () => {
                    toast({
                        title: "Statut mis à jour",
                        description: `La réservation a été marquée comme ${status}.`,
                    });
                },
                onError: () => {
                    toast({
                        title: "Erreur",
                        description: "Impossible de mettre à jour le statut.",
                        variant: "destructive",
                    });
                },
            }
        );
    };

    // Admin-specific action buttons
    const adminActions = reservation && (
        <>
            {reservation.status === "PENDING" && (
                <>
                    <Button
                        variant="default"
                        onClick={() => handleUpdateStatus("CONFIRMED")}
                        disabled={updateReservationMutation.isPending}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        {updateReservationMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Confirmer
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => handleUpdateStatus("CANCELLED")}
                        disabled={updateReservationMutation.isPending}
                    >
                        {updateReservationMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Annuler
                    </Button>
                </>
            )}
            {reservation.status === "CONFIRMED" && (
                <Button
                    variant="default"
                    onClick={() => handleUpdateStatus("COMPLETED")}
                    disabled={updateReservationMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    {updateReservationMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
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
        />
    );
};

export default AdminReservationDetail;
