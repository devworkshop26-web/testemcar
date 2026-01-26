import { useRef } from "react";
import { useParams } from "react-router-dom";
import { useReservationQuery, useUpdateReservationMutation } from "@/useQuery/reservationsUseQuery";
import { useUploadPaymentProofMutation } from "@/useQuery/paymentUseQuery";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { XCircle, Download, Loader2, Info } from "lucide-react";
import { ReservationDetailPro } from "@/components/reservation/ReservationDetailPro";

const BookingClientDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: reservation, isLoading } = useReservationQuery(id);
  const updateReservationMutation = useUpdateReservationMutation();
  const uploadPaymentProofMutation = useUploadPaymentProofMutation();

  const handleCancelReservation = () => {
    if (!reservation) return;

    updateReservationMutation.mutate(
      {
        id: reservation.id,
        payload: { status: "CANCELLED" },
      },
      {
        onSuccess: () => {
          toast({
            title: "Réservation annulée",
            description: "Votre réservation a été annulée avec succès.",
          });
        },
        onError: () => {
          toast({
            title: "Erreur",
            description: "Impossible d'annuler la réservation.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDownloadInvoice = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "Le téléchargement de la facture sera bientôt disponible.",
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && reservation) {
      uploadPaymentProofMutation.mutate(
        {
          reservation_id: reservation.id,
          proof_image: file,
        },
        {
          onSuccess: () => {
            toast({
              title: "Preuve envoyée",
              description: "Votre preuve de paiement a été envoyée avec succès.",
            });
          },
          onError: () => {
            toast({
              title: "Erreur",
              description: "Impossible d'envoyer la preuve de paiement.",
              variant: "destructive",
            });
          },
        }
      );
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Client-specific action buttons
  const clientActions = reservation && (
    <>
      {reservation.status === "CONFIRMED" && (
        <Button variant="outline" className="gap-2" onClick={handleDownloadInvoice}>
          <Download className="w-4 h-4" />
          Facture
        </Button>
      )}
      {reservation.status === "PENDING" && (
        <>
          <Button variant="default" onClick={handleUploadClick}>
            Envoyer une preuve
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Button
            variant="destructive"
            className="gap-2"
            onClick={handleCancelReservation}
            disabled={updateReservationMutation.isPending}
          >
            {updateReservationMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            Annuler
          </Button>
        </>
      )}
    </>
  );

  // Payment pending alert
  const pendingAlert = reservation?.status === "PENDING" && (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <div className="bg-blue-100 p-3 rounded-full shrink-0">
          <Info className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-blue-800 mb-2">Paiement en attente de validation</h3>
          <p className="text-blue-700 text-sm">
            Votre réservation est en attente de validation du paiement. Veuillez envoyer votre preuve de paiement si ce n'est pas encore fait.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <ReservationDetailPro
      reservation={reservation}
      isLoading={isLoading}
      backUrl="/client/booking"
      actions={clientActions}
      alerts={pendingAlert}
    />
  );
};

export default BookingClientDetail;
