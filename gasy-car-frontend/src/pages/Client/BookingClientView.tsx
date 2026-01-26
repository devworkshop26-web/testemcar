import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useReservationClientQuery } from "@/useQuery/clientUseQuery";
import {  Filter, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUserQuery } from "@/useQuery/useCurrentUserQuery";

const BookingsClientsView = () => {
  const { data: currentUser } = useCurrentUserQuery();
  const { data, isLoading } = useReservationClientQuery(currentUser?.id);
  const navigate = useNavigate();







  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-poppins">
            Réservations
          </h2>
          <p className="text-gray-500 text-sm">
            Suivi des demandes et locations en cours.
          </p>
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
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-8 w-8 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : data && data.length > 0 ? (
                <>
                  {data.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/client/booking/${item.id}`)}
                    >
                      <td className="px-6 py-4 font-mono text-sm font-semibold text-gray-900">
                        {item.reference}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {(() => {
                              const vehicle = item.vehicle_data;
                              const photo =
                                (vehicle as any)?.photo_principale ||
                                vehicle?.photos?.find((p: any) => p.is_primary)?.image ||
                                (vehicle?.photos?.find((p: any) => (p as any).is_primary) as any)?.image_url ||
                                vehicle?.photos?.[0]?.image ||
                                (vehicle?.photos?.[0] as any)?.image_url;

                              return photo ? (
                                <img
                                  src={photo}
                                  alt="Car"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Skeleton className="w-full h-full bg-gray-200" />
                              );
                            })()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.vehicle_data?.marque_data?.nom ?? (item.vehicle_data as any)?.marque_nom ?? "Marque"}{" "}
                              {item.vehicle_data?.modele_data?.label ?? (item.vehicle_data as any)?.modele_label ?? item.vehicle_data?.titre ?? "Modèle"}
                            </p>
                            <p className="text-xs text-gray-500">{item.vehicle_data?.categorie_data?.nom ?? (item.vehicle_data as any)?.categorie_nom ?? "Catégorie"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary overflow-hidden">
                            {item.client_data?.image ? (
                              <img src={item.client_data.image} alt="Client" className="w-full h-full object-cover" />
                            ) : (
                              <span>{item.client_data?.first_name?.[0]}{item.client_data?.last_name?.[0]}</span>
                            )}
                          </div>
                          <span className="text-sm text-gray-700">
                            {item.client_data?.first_name} {item.client_data?.last_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {new Date(item.start_datetime).toLocaleDateString()} - {new Date(item.end_datetime).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {Number(item.total_amount).toLocaleString()} Ar
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${item.status === "PENDING" ? "bg-orange-100 text-orange-700 border-orange-200" :
                          item.status === "CONFIRMED" ? "bg-green-100 text-green-700 border-green-200" :
                            item.status === "CANCELLED" ? "bg-red-100 text-red-700 border-red-200" :
                              "bg-gray-100 text-gray-700 border-gray-200"
                          }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/client/booking/${item.id}`);
                            }}
                          >
                            <Eye className="w-4 h-4 text-gray-400" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-10 text-center text-sm text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Filter className="w-8 h-8 text-gray-200" />
                      <p>Il n'y a pas de donnée pour le moment.</p>
                    </div>
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
        {/* Pagination simple */}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
          <span>Affichage 1-5 sur 24</span>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" disabled>
              Précédent
            </Button>
            <Button variant="ghost" size="sm">
              Suivant
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BookingsClientsView;
