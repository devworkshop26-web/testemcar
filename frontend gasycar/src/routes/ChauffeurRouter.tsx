import DashboardChauffeur from '@/pages/Chauffeur/DashboardChauffeur'
import { Route, Routes } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'

export const ChauffeurRoutes = () => {
  return (
    <>
      <Route element={<PrivateRoute allowedRoles={["CHAUFFEUR"]} />}>
        <Route path="/driver" element={<DashboardChauffeur />} />
      </Route>
    </>
  );
};

