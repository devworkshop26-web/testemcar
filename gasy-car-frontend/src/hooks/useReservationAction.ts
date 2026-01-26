import { useCurrentUserQuery } from "@/useQuery/useCurrentUserQuery";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useReservationAction = () => {
  const { isAuthenticated, data: currentUser } = useCurrentUserQuery();
  const navigate = useNavigate();

  

  const handleReserve = (vehicleId: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (currentUser && currentUser.role !== "CLIENT") {
      toast.error("Vous n'avez pas la permission d'effectuer une réservation.");
      return;
    }

    

    navigate(`/vehicule/${vehicleId}`);
  };

  return { handleReserve };
};
