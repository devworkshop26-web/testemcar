import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UserRole } from "@/types/userType";
import { useCurrentUserQuery } from "@/useQuery/useCurrentUserQuery";

type PrivateRouteProps = {
  allowedRoles?: UserRole[];
  redirectTo?: string;
  // allow to use simple string like "CLIENT" instead of UserRole type
  // allowedRoles?: (UserRole | string)[];  <-- Removed commented code as it is not valid TS syntax for this context block
};

export function PrivateRoute({
  allowedRoles,
  redirectTo = "/unauthorized",
}: PrivateRouteProps) {
  const { data: user, isAuthenticated, isLoading } = useCurrentUserQuery();
  const role = user?.role;
  const location = useLocation();



  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-300 border-t-emerald-600 rounded-full animate-spin" />
          <p>Vérification de votre session...</p>
        </div>
      </div>
    );
  }

  // ❌ Not authenticated → Redirect to login and save current location
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ❌ Authenticated but wrong role
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to={redirectTo} replace />;
  }

  // 🔓 Authorized → Access granted
  return <Outlet />;
}
