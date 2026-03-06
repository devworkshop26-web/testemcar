import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Booking {
  id: string;
  client: string;
  car: string;
  dates: string;
  amount: string;
  status: string;
  avatar: string;
}

interface RecentBookingsProps {
  bookings: Booking[];
}

const RecentBookings = ({ bookings }: RecentBookingsProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En cours": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Confirmé": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Terminé": return "bg-gray-100 text-gray-700 border-gray-200";
      case "En attente": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Card className="border-none shadow-md rounded-2xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold text-gray-900 font-poppins">Réservations Récentes</CardTitle>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </Button>
      </CardHeader>
      <div className="overflow-x-auto">
        {bookings.length > 0 ? (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Véhicule</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                        {booking.avatar}
                      </div>
                      <span className="font-medium text-gray-900">{booking.client}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{booking.car}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{booking.dates}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">{booking.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-gray-500">
            Aucune réservation récente
          </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-center">
        <Button variant="link" onClick={() => navigate('/prestataire/booking')} className="text-primary h-auto p-0 font-medium">
          Voir toutes les réservations
        </Button>
      </div>
    </Card>
  );
};

export default RecentBookings;
