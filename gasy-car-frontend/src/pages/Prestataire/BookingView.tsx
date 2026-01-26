import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Filter, Check, X, Eye } from "lucide-react";
import { useAllReservationOfMyvehiculeQuery } from "@/useQuery/reservationsUseQuery";
import { useCurentuser } from "@/useQuery/authUseQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const BookingsView = () => {
  const { user } = useCurentuser();
  const navigate = useNavigate();
  const { data: allReservations = [], isLoading: isLoadingReservations } = useAllReservationOfMyvehiculeQuery(user?.id);



  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING": return "En attente";
      case "CONFIRMED": return "Confirmé";
      case "IN_PROGRESS": return "En cours";
      case "COMPLETED": return "Terminé";
      case "CANCELLED": return "Annulé";
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-orange-100 text-orange-700 border-orange-200";
      case "CONFIRMED": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-700 border-blue-200";
      case "COMPLETED": return "bg-gray-100 text-gray-700 border-gray-200";
      case "CANCELLED": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-poppins">Réservations</h2>
          <p className="text-gray-500 text-sm">Suivi des demandes et locations en cours.</p>
        </div>

      </div>

      <Card className="border-none shadow-md rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Référence</th>
                <th className="px-6 py-4">Véhicule</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Période</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoadingReservations ? (
                // Skeleton loader
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : allReservations.length > 0 ? (
                allReservations?.map((reservation: any, index: number) => {
                  return (
                    <tr key={reservation.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm font-semibold text-gray-900">{reservation.reference}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {reservation.vehicle_data?.titre || reservation.vehicle || "N/A"}
                        <div className="text-xs text-gray-500">
                          {reservation.vehicle_data?.marque?.nom} {reservation.vehicle_data?.modele?.label}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                            {reservation.client_data?.first_name?.substring(0, 2).toUpperCase() ||
                              reservation.client_data?.email?.substring(0, 2).toUpperCase() || "CL"}
                          </div>
                          <div>
                            <div className="font-medium">
                              {reservation.client_data?.first_name || reservation.client_data?.email || reservation.client_data || "N/A"}
                            </div>
                            {reservation.client_data?.first_name && reservation.client_data?.last_name && (
                              <div className="text-xs text-gray-500">
                                {reservation.client_data.first_name} {reservation.client_data.last_name}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(reservation.start_datetime).toLocaleDateString()} - {new Date(reservation.end_datetime).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium">{parseInt(reservation.total_amount).toLocaleString()} Ar</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(reservation.status)}`}>
                          {getStatusLabel(reservation.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => navigate(`/prestataire/bookings/${reservation.id}`)}
                          >
                            <Eye className="w-4 h-4 text-gray-400" />
                          </Button>
                          {reservation.status === "PENDING" && (
                            <>
                              <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"><Check className="w-4 h-4" /></button>
                              <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Aucune réservation trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination simple */}
        {allReservations.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
            <span>Affichage 1-{Math.min(allReservations.length, 10)} sur {allReservations.length}</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" disabled>Précédent</Button>
              <Button variant="ghost" size="sm">Suivant</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BookingsView;