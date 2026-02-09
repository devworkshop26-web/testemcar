import { useCurrentUserQuery } from "@/useQuery/useCurrentUserQuery";
import { useNavigate } from "react-router-dom";

export const useReservationAction = () => {
  const { isAuthenticated } = useCurrentUserQuery();
  const navigate = useNavigate();

  

  const handleReserve = (vehicleId: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    navigate(`/vehicule/${vehicleId}`);
  };

  return { handleReserve };
};
