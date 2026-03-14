import { useParams } from "react-router-dom";
import { useReservationQuery } from "@/useQuery/reservationsUseQuery";
import { ReservationDetailView } from "@/components/support/ReservationDetailView";

export default function SupportReservationDetailPage() {
  const { id } = useParams();
  const { data: reservation, isLoading } = useReservationQuery(id);

  return (
    <ReservationDetailView
      reservation={reservation}
      isLoading={isLoading}
      backUrl="/support/reservations"
    />
  );
}
