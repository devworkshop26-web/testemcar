import { Route } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";

import DashboardSupport from "@/pages/Support/DashboardSupport";
import ClientsView from "@/pages/Support/ClientsView";
import FleetView from "@/pages/Support/FleetView";
import TicketsList from "@/pages/Support/TicketsList";
import TicketDetailsSupport from "@/pages/Support/tickets/TicketDetailsSupport";
import CreateTicketSupport from "@/pages/Support/tickets/CreateTicketSupport";
import SettingsView from "@/pages/Support/SettingsView";
import LayoutSupport from "@/pages/Support/LayoutSupport/LayoutSupport";
import ClientDetailView from "@/pages/Support/ClientDetailView";
import ClientEditView from "@/pages/Support/ClientEditView";
import VehiculeDetailView from "@/pages/Support/VehiculeDetailView";
import SupportReservationPage from "@/pages/Support/reservation/SupportReservation";
import SupportReservationDetailPage from "@/pages/Support/reservation/SupportReservationDetailPage";
import ReviewsView from "@/pages/Support/ReviewsView";

export const SupportRoutes = () => {
  return (
    <Route element={<PrivateRoute allowedRoles={["SUPPORT"]} />}>
      <Route path="/support" element={<LayoutSupport />}>
        <Route index element={<DashboardSupport />} />
        <Route path="reservations" element={<SupportReservationPage />} />
        <Route path="reservations/:id" element={<SupportReservationDetailPage />} />
        <Route path="clients" element={<ClientsView />} />
        <Route path="client/:id" element={<ClientDetailView />} />
        <Route path="client/:id/edit" element={<ClientEditView />} />
        <Route path="fleet" element={<FleetView />} />
        <Route path="fleet/vehicule/:id" element={<VehiculeDetailView />} />
        <Route path="tickets" element={<TicketsList />} />
        <Route path="ticket/:id" element={<TicketDetailsSupport />} />
        <Route path="tickets/create" element={<CreateTicketSupport />} />
        <Route path="settings" element={<SettingsView />} />
        <Route path="reviews" element={<ReviewsView />} />
      </Route>
    </Route>
  );
};