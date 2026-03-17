import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, DollarSign, Calendar, TrendingUp, Plus } from "lucide-react";
import { Link } from "react-router-dom";
// import ChatBubble from "@/components/ChatBubble";

const DashboardOwner = () => {
  const stats = [
    { title: "Véhicules actifs", value: "3", icon: Car },
    { title: "Revenus ce mois", value: "245,000 Ar", icon: DollarSign },
    { title: "Réservations", value: "12", icon: Calendar },
    { title: "Taux d'occupation", value: "78%", icon: TrendingUp },
  ];

  const vehicles = [
    {
      id: 1,
      name: "2023 Toyota RAV4",
      image: "/placeholder.svg",
      status: "Disponible",
      price: "85,000 Ar/jour",
      bookings: 47,
    },
    {
      id: 2,
      name: "2022 Honda CR-V",
      image: "/placeholder.svg",
      status: "Loué",
      price: "75,000 Ar/jour",
      bookings: 32,
    },
    {
      id: 3,
      name: "2024 Mazda CX-5",
      image: "/placeholder.svg",
      status: "Disponible",
      price: "90,000 Ar/jour",
      bookings: 18,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div>
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-bold">Mon Tableau de Bord</h1>
            <Button className="btn-primary gap-2 text-xs sm:text-sm md:text-base">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Ajouter un véhicule
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, idx) => (
              <Card key={idx}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-xl sm:text-2xl md:text-3xl font-poppins font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Vehicles */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Mes Véhicules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="border border-border rounded-xl overflow-hidden">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-poppins font-semibold text-base sm:text-lg mb-2">
                        {vehicle.name}
                      </h3>
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <span
                          className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full ${
                            vehicle.status === "Disponible"
                              ? "bg-success/20 text-success"
                              : "bg-primary/20 text-primary"
                          }`}
                        >
                          {vehicle.status}
                        </span>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {vehicle.bookings} voyages
                        </span>
                      </div>
                      <p className="text-lg sm:text-xl font-poppins font-bold text-primary mb-2 sm:mb-3">
                        {vehicle.price}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm">
                          Modifier
                        </Button>
                        <Button size="sm" className="flex-1 btn-primary text-xs sm:text-sm">
                          Voir
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Réservations Récentes</CardTitle>
            </CardHeader>
            <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                {[...Array(5)].map((_, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 border-b border-border pb-3 sm:pb-4"
                  >
                    <div>
                      <p className="text-sm sm:text-base font-semibold">Marie Dupont</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        2023 Toyota RAV4 • 15-20 Nov 2024
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm sm:text-base font-bold text-primary">425,000 Ar</p>
                      <span className="text-xs badge-certified">Confirmée</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* <ChatBubble /> */}
    </div>
  );
};

export default DashboardOwner;
