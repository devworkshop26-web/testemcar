import { useNavigate, useParams } from "react-router-dom";
import { useReservationQuery } from "@/useQuery/reservationsUseQuery";
import { ReservationDetailPro } from "@/components/reservation/ReservationDetailPro";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

const PrestataireReservationDetail = () => {
    const { id } = useParams();
    const { data: reservation, isLoading } = useReservationQuery(id);
    const navigate = useNavigate();

    const actions = reservation && !reservation.payment && (
        <Button
            variant="default"
            className="gap-2"
            onClick={() => navigate(`/reservation-payment/${reservation.id}`)}
        >
            <CreditCard className="w-4 h-4" />
            Payer la réservation
        </Button>
    );

    return (
        <ReservationDetailPro
            reservation={reservation}
            isLoading={isLoading}
            backUrl="/prestataire/booking"
            actions={actions}
        />
    );
};

export default PrestataireReservationDetail;
