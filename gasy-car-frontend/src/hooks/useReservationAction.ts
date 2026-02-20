import { useCurrentUserQuery } from "@/useQuery/useCurrentUserQuery";
import { useNavigate } from "react-router-dom";

export const useReservationAction = () => {
  useCurrentUserQuery();
  const navigate = useNavigate();

  const handleReserve = (vehicleId: string) => {
    navigate(`/vehicule/${vehicleId}`);
  };

  return { handleReserve };
};
