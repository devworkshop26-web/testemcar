import { useNavigate } from "react-router-dom";

export const useReservationAction = () => {
  const navigate = useNavigate();

  const handleReserve = (vehicleId: string) => {
    navigate(`/vehicule/${vehicleId}`);
  };

  return { handleReserve };
};
