import { AdminAnalyticsPage } from "@/pages/Admin/AdminAnalyticsPage";
import { AdminClientsPage } from "@/pages/Admin/users/AdminClientsPage";
import { AdminInboxPage } from "@/pages/Admin/AdminInboxPage";
import { AdminMarketingPage } from "@/pages/Admin/AdminMarketingPage";
import { AdminOwnersPage } from "@/pages/Admin/users/AdminOwnersPage";
import { AdminPaymentsPage } from "@/pages/Admin/AdminPaymentsPage";
import { AdminSettingsPage } from "@/pages/Admin/AdminSettingsPage";
import { AdminSupportUsersPage } from "@/pages/Admin/users/AdminSupportUsersPage";
import { AdminTrustSafetyPage } from "@/pages/Admin/AdminTrustSafetyPage";
import { AdminUsersPage } from "@/pages/Admin/users/AdminUsersPage";
import { AdminVehicleCertificationsPage } from "@/pages/Admin/AdminVehicleCertificationsPage";
import { AdminVehicleDisputesPage } from "@/pages/Admin/AdminVehicleDisputesPage";
import { AdminVehicleMaintenancePage } from "@/pages/Admin/AdminVehicleMaintenancePage";
import { AdminVehiclesPage } from "@/pages/Admin/vehicles/AdminVehiclesPage";
import { AdminVehicleDetailPage } from "@/pages/Admin/vehicles/AdminVehicleDetailPage";
import { AdminDashboardPage } from "@/pages/Admin/DashboardAdmins";
import { AdminDriversPage } from "@/pages/Admin/users/AdminDriversPage";
import { AdminDriverDetailPage } from "@/pages/Admin/users/AdminDriverDetailPage";
import { AdminDriverEditPage } from "@/pages/Admin/users/AdminDriverEditPage";
import AdminModePaymentsPage from "@/pages/Admin/AdminModePaymentsPage";
import LayoutAdmin from "@/pages/Admin/LayoutAdmin/LayoutAdmin";
import AdminCategoriesPage from "@/pages/Admin/vehicles/AdminCategories";
import AdminFuelTypesPage from "@/pages/Admin/vehicles/AdminFuelTypes";
import AdminMarquesPage from "@/pages/Admin/vehicles/AdminMarques";
import AdminModelsPage from "@/pages/Admin/vehicles/AdminModels";
import AdminStatusPage from "@/pages/Admin/vehicles/AdminStatus";
import AdminTransmissionsPage from "@/pages/Admin/vehicles/AdminTransmissions";
import AdminVehicleEquipments from "@/pages/Admin/vehicles/AdminVehicleEquipments";
import AdminReservationsPage from "@/pages/Admin/reservation/AdminReservation";
import { AdminReservationDetail } from "@/pages/Admin/reservation";

import { Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import AdminCreateVehiculePage from "@/pages/Admin/vehicles/AdminCreateVehiculePage";
import AdminEditVehiculePage from "@/pages/Admin/vehicles/AdminEditVehiculePage";
import AdminBlogPage from "@/pages/Admin/AdminBlogPage";
import AdminAddBlogPage from "@/pages/Admin/AdminAddBlogPage";
import AdminUpdateBlogPage from "@/pages/Admin/AdminUpdateBlogPage";

export const AdminRoutes = () => {
  return (
    <>
      {/* PROTECTION TOTALE DE L'ADMIN */}
      <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin" element={<LayoutAdmin />}>

          {/* Dashboard */}
          <Route index element={<AdminDashboardPage />} />

          {/* Inbox */}
          <Route path="inbox" element={<AdminInboxPage />} />

          {/* Analytics */}
          <Route path="analytics" element={<AdminAnalyticsPage />} />

          {/* Users */}
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="users/clients" element={<AdminClientsPage />} />
          <Route path="users/owners" element={<AdminOwnersPage />} />
          <Route path="users/drivers" element={<AdminDriversPage />} />
          <Route path="users/drivers/:id" element={<AdminDriverDetailPage />} />
          <Route path="users/drivers/:id/edit" element={<AdminDriverEditPage />} />
          <Route path="users/support" element={<AdminSupportUsersPage />} />

          {/* Vehicles */}
          <Route path="vehicles" element={<AdminVehiclesPage />} />
          <Route path="vehicles/create" element={<AdminCreateVehiculePage />} />
          <Route path="vehicles/:id" element={<AdminVehicleDetailPage />} />
          <Route path="vehicles/:id" element={<AdminVehicleDetailPage />} />
          <Route path="vehicles/:id/edit" element={<AdminEditVehiculePage />} />
          <Route path="vehicles/certifications" element={<AdminVehicleCertificationsPage />} />
          <Route path="vehicles/certifications" element={<AdminVehicleCertificationsPage />} />
          <Route path="vehicles/maintenance" element={<AdminVehicleMaintenancePage />} />
          <Route path="vehicles/disputes" element={<AdminVehicleDisputesPage />} />

          {/* VEHICLE SETTINGS BAR */}
          <Route path="vehicles/marques" element={<AdminMarquesPage />} />
          <Route path="vehicles/categories" element={<AdminCategoriesPage />} />
          <Route path="vehicles/transmissions" element={<AdminTransmissionsPage />} />
          <Route path="vehicles/fuel-types" element={<AdminFuelTypesPage />} />
          <Route path="vehicles/status" element={<AdminStatusPage />} />
          <Route path="vehicles/models" element={<AdminModelsPage />} />
          <Route path="vehicles/equipements" element={<AdminVehicleEquipments />} />
          <Route path="vehicles/equipements/:id" element={<AdminVehicleEquipments />} />

          {/* Create Vehicule */}
          <Route path="vehcule-create" element={<AdminCreateVehiculePage />} />

          {/* Actions */}
          <Route path="marketing" element={<AdminMarketingPage />} />
          <Route path="reservations" element={<AdminReservationsPage />} />
          <Route path="reservations/:id" element={<AdminReservationDetail />} />

          {/* Platform */}
          <Route path="mode-payments" element={<AdminModePaymentsPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="trust-safety" element={<AdminTrustSafetyPage />} />

          {/* blogs */}
          <Route path="blogs" element={<AdminBlogPage />} />
          <Route path="blogs/new" element={<AdminAddBlogPage />} />
          <Route path="blogs/edit/:id" element={<AdminUpdateBlogPage />} />
        </Route>
      </Route>
    </>
  );
}
