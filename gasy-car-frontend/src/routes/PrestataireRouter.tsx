import SettingsView from "@/pages/Prestataire/SettingsView";
import AddVehicleForm from "@/pages/Prestataire/AddVehicleForm";
import BookingsView from "@/pages/Prestataire/BookingView";
import PrestataireReservationDetail from "@/pages/Prestataire/PrestataireReservationDetail";
import CustomersView from "@/pages/Prestataire/CustomersView";
import DashboardPrestataire from "@/pages/Prestataire/DashboardPrestataire";
import FinanceView from "@/pages/Prestataire/FinanceView";
import FleetView from "@/pages/Prestataire/FleetView";
import { IndexPrestataire } from "@/pages/Prestataire/IndexPrestataire";
import { Route, Routes } from "react-router-dom";
// 👈 NOUVEL IMPORT
import { PrivateRoute } from "./PrivateRoute";
import VehicleAvailabilityPage from "@/pages/Prestataire/VehicleAvailabilityPage";
import VehicleManagePage from "@/pages/Prestataire/VehicleManagePage";
import EditVehiclePage from "@/pages/Prestataire/EditVehiclePage";
import DriversView from "@/pages/Prestataire/DriversView";
import DriverDetailsView from "@/pages/Prestataire/DriverDetailsView";
import VehiclePhotosPage from "@/pages/Prestataire/VehiclePhotosPage";
import CreateTicketPrestataire from "@/pages/Prestataire/Support/CreateTicketPrestataire";
import TicketDetailsPrestataire from "@/pages/Prestataire/Support/TicketDetailsPrestataire";
import MyTickets from "@/pages/Support/MyTickets Prestataire";
import VehicleConditionReportPage from "@/pages/Prestataire/VehicleConditionReportPage";

export const PrestataireRoutes = () => {
  return (
    <>
      <Route element={<PrivateRoute allowedRoles={["PRESTATAIRE"]} />}>
        <Route path="/prestataire" element={<IndexPrestataire />}>
          <Route index element={<DashboardPrestataire />} />
          <Route path="dashboard" element={<DashboardPrestataire />} />
          <Route path="customer" element={<CustomersView />} />
          <Route path="booking" element={<BookingsView />} />
          <Route path="bookings/:id" element={<PrestataireReservationDetail />} />
          <Route path="finances" element={<FinanceView />} />
          <Route path="parameters" element={<SettingsView />} />
          <Route path="drivers" element={<DriversView />} />
          <Route path="drivers/:id" element={<DriverDetailsView />} />
          <Route path="availability" element={<VehicleAvailabilityPage />} />

          <Route path="vehicle/:id/manage" element={<VehicleManagePage />} />
          {/* Ajouter cette ligne pour la modification */}
          <Route path="vehicle/:id/edit" element={<EditVehiclePage />} />
          <Route path="/prestataire/vehicle/:id/photos" element={<VehiclePhotosPage />} />
          <Route path="fleet">
            <Route index element={<FleetView />} />
            <Route path="addvehicle" element={<AddVehicleForm onBack={function (): void {
              throw new Error("Function not implemented.");
            }} />} />
          </Route>
          {/* SUPPORT SYSTEM */}
          <Route path="supports/create" element={<CreateTicketPrestataire />} />
          <Route path="supports/my-tickets" element={<MyTickets />} />
          <Route path="supports/ticket/:id" element={<TicketDetailsPrestataire />} />
          <Route path="condition-report" element={<VehicleConditionReportPage />} />

        </Route>
      </Route>
    </>
  );
}