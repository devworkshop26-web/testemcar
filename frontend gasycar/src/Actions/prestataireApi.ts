import { InstanceAxis } from "@/helper/InstanceAxios";

export const prestataireAPI = {
    // Récupérer le profil prestataire de l'utilisateur connecté
    getMyProfile: () => InstanceAxis.get("/prestataires/me/"),

    // Mettre à jour le profil prestataire de l'utilisateur connecté
    updateMyProfile: (data: any) =>
        InstanceAxis.patch("/prestataires/me/", data, {
            headers: {
                "Content-Type":
                    data instanceof FormData ? "multipart/form-data" : "application/json",
            },
        }),

    // Créer un profil prestataire (si le flux le demande explicitement, sinon le backend le crée/lie souvent auto)
    // Mais ici 'create' standard via viewset est POST /prestataires/
    createPrestataire: (data: any) =>
        InstanceAxis.post("/prestataires/", data, {
            headers: {
                "Content-Type":
                    data instanceof FormData ? "multipart/form-data" : "application/json",
            },
        }),
};
