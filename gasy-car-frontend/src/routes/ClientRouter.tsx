import { Route, Routes } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";

// CLIENT PAGES
import LayoutClient from "@/pages/Client/LayoutClient/LayoutClient";
import DashboardOverClientView from "@/pages/Client/DashboardClientView";
import BookingsClientsView from "@/pages/Client/BookingClientView";
import BrowseCarsClientView from "@/pages/Client/BrowseCarsClientView";
import BookingClientDetail from "@/pages/Client/BookingClientDetail";
import FavoritesClientView from "@/pages/Client/FavoritesClientView";
import SettingsClientView from "@/pages/Client/SettingsClientView";
import LoyaltyClientView from "@/pages/Client/LoyaltyClientView";

// SUPPORT PAGES
import CreateTicketClient from "@/pages/Client/Support/CreateTicketClient";
import MyTickets from "@/pages/Support/MyTickets";
import TicketDetailsClient from "@/pages/Client/Support/TicketDetailsClient";
import ReservationFormPage from "@/pages/Reservation/ReservationFormPage";
import VehicleConditionReportPage from "@/pages/Prestataire/VehicleConditionReportPage";

export const ClientRoutes = () => {
  return (
    <>
      <Route element={<PrivateRoute allowedRoles={["CLIENT"]} />}>
        <Route path="/client" element={<LayoutClient />}>
          <Route index element={<DashboardOverClientView />} />
          <Route path="booking" element={<BookingsClientsView />} />
          <Route path="booking/:id" element={<BookingClientDetail />} />
          <Route path="browse" element={<BrowseCarsClientView />} />
          <Route path="rentals" element={<BookingsClientsView />} />
          <Route path="rentals/:id" element={<BookingClientDetail />} />
          <Route path="condition-report" element={<VehicleConditionReportPage />} />
          <Route path="favorites" element={<FavoritesClientView />} />
          <Route path="settings" element={<SettingsClientView />} />
          <Route path="loyalty" element={<LoyaltyClientView />} />
          <Route path="reservation/:vehicleId" element={<ReservationFormPage />} />

          {/* SUPPORT SYSTEM */}
          <Route path="supports/create" element={<CreateTicketClient />} />
          <Route path="supports/my-tickets" element={<MyTickets />} />
          <Route path="supports/ticket/:id" element={<TicketDetailsClient />} />
        </Route>
      </Route>
    </>
  );
}
