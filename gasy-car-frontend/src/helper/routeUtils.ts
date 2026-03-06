import { UserRole } from "@/types/userType";

/**
 * Returns the default dashboard path for a given user role.
 */
export const getDashboardPath = (role: UserRole | string | null | undefined): string => {
    if (!role) return "/";

    if (role === "ADMIN") return "/admin";
    if (role === "PRESTATAIRE") return "/prestataire";
    if (role === "CLIENT") return "/client";
    if (role === "CHAUFFEUR") return "/driver";
    if (role === "MECANICIEN") return "/mecanicien";
    if (role === "SUPPORT") return "/support";

    return "/";
};
