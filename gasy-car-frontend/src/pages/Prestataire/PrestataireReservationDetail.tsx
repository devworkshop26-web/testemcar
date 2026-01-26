import { useParams } from "react-router-dom";
import { useReservationQuery } from "@/useQuery/reservationsUseQuery";
import { ReservationDetailPro } from "@/components/reservation/ReservationDetailPro";

const PrestataireReservationDetail = () => {
    const { id } = useParams();
    const { data: reservation, isLoading } = useReservationQuery(id);

    return (
        <ReservationDetailPro
            reservation={reservation}
            isLoading={isLoading}
            backUrl="/prestataire/booking"
        />
    );
};

export default PrestataireReservationDetail;
