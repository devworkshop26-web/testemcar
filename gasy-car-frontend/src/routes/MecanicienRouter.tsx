import DashboardMecanicien from "@/pages/Mecanicien/DashboardMecanicien";
import { Route, Routes } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";

export const MecanicienRoutes = () => {
  return (
    <>
      <Route element={<PrivateRoute allowedRoles={["MECANICIEN"]} />}>
        <Route path="/mecanicien" element={<DashboardMecanicien />} />
      </Route>
    </>
  );
};

