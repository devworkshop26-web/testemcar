import { InstanceAxis } from "@/helper/InstanceAxios";
import { CreateReviewPayload, Review, UpdateReviewPayload } from "@/types/reveiewType";

export const reviewAPI = {
  // ========================================
  // 🔥 CRUD de base
  // ========================================
  
  // Liste de tous les reviews
  getAll: async (): Promise<Review[]> => {
    const response = await InstanceAxis.get<Review[]>("/reviews/reviews/");
    return response.data;
  },

  // Récupérer un avis spécifique
  getOne: async (id: string): Promise<Review> => {
    const response = await InstanceAxis.get<Review>(`/reviews/reviews/${id}/`);
    return response.data;
  },

  // Créer un avis
  create: async (payload: CreateReviewPayload): Promise<Review> => {
    const response = await InstanceAxis.post<Review>("/reviews/reviews/", payload);
    return response.data;
  },

  // Modifier un avis
  update: async (id: string, payload: UpdateReviewPayload): Promise<Review> => {
    const response = await InstanceAxis.put<Review>(`/reviews/reviews/${id}/`, payload);
    return response.data;
  },

  // Supprimer un avis
  delete: async (id: string): Promise<void> => {
    await InstanceAxis.delete<void>(`/reviews/reviews/${id}/`);
  },

  // ========================================
  // 🔥 Actions personnalisées
  // ========================================

  // Récupérer les avis liés à une réservation
  getByReservation: async (reservationId: string): Promise<Review[]> => {
    const response = await InstanceAxis.get<Review[]>(`/reviews/reviews/reservation/${reservationId}/`);
    return response.data;
  },

  // Récupérer les avis écrits PAR un utilisateur
  getWrittenByUser: async (userId: string): Promise<Review[]> => {
    const response = await InstanceAxis.get<Review[]>(`/reviews/reviews/user/${userId}/written/`);
    return response.data;
  },

  // Récupérer les avis reçus PAR un utilisateur (ex: le propriétaire du véhicule)
  getReceivedByUser: async (userId: string): Promise<Review[]> => {
    const response = await InstanceAxis.get<Review[]>(`/reviews/reviews/user/${userId}/received/`);
    return response.data;
  },

  // Récupérer les réservations éligibles pour laisser un avis
  getPendingReservations: async (vehicleId: string): Promise<any[]> => {
    const response = await InstanceAxis.get(`/reviews/reviews/pending/?vehicle_id=${vehicleId}`);
    return response.data;
  },
};