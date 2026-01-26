// src/Actions/supportApi.ts
import { InstanceAxis } from "@/helper/InstanceAxios";

export const supportAPI = {
  // Tous les tickets
  get_all_tickets: () => InstanceAxis.get("/support/support-tickets/"),

  // Détail d’un ticket
  get_ticket_detail: (id: string) =>
    InstanceAxis.get(`/support/support-tickets/${id}/`),

  // Messages d’un ticket (filtrés)
  get_ticket_messages: (ticketId: string) =>
    InstanceAxis.get(`/support/tickets-message/?ticket=${ticketId}`),

  // Créer un ticket
  create_ticket: (payload: any) =>
    InstanceAxis.post("/support/support-tickets/", payload),

  // Modifier un ticket
  update_ticket: (id: string, payload: any) =>
    InstanceAxis.patch(`/support/support-tickets/${id}/`, payload),

  // Créer un message
  create_message: (payload: any) =>
    InstanceAxis.post("/support/tickets-message/", payload),

  // ⭐ SUPPRESSION — manquait dans ton code ⭐
  delete_ticket: (id: string) =>
    InstanceAxis.delete(`/support/support-tickets/${id}/`),
};
