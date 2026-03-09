
import { Navigate, Outlet } from "react-router-dom";
import { getDashboardPath } from "@/helper/routeUtils";
import { useCurrentUserQuery } from "@/useQuery/useCurrentUserQuery";

export function PublicRoute() {
    const { data: user, isAuthenticated, isLoading } = useCurrentUserQuery();
    const role = user?.role;


    // if (isLoading) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center text-slate-600">
    //             <div className="flex flex-col items-center gap-4">
    //                 <div className="w-10 h-10 border-4 border-slate-300 border-t-emerald-600 rounded-full animate-spin" />
    //                 <p>Vérification de votre session...</p>
    //             </div>
    //         </div>
    //     );
    // }

    // ✅ Authenticated → Redirect to appropriate dashboard
    if (isAuthenticated) {
        const destination = getDashboardPath(role);
        return <Navigate to={destination} replace />;
    }

    // 🔓 Not Authenticated → Access granted
    return <Outlet />;
}
