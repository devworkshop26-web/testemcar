import { useVehiculeDetail } from "@/useQuery/useVehiculeDetail";
import { useParams } from "react-router-dom";
import VehicleOwnerInfo from "./VehicleOwnerInfo";

export default function VehiculeDetailView() {
  const { id } = useParams();
  const { data: vehicle, isLoading } = useVehiculeDetail(id);

  if (isLoading) return <div>Chargement...</div>;
  if (!vehicle) return null;

  return (
    <div>
      {/* autres sections */}

      <VehicleOwnerInfo vehicle={vehicle} />

      {/* autres sections */}
    </div>
  );
}
