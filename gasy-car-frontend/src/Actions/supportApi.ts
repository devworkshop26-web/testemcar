import { InstanceAxis } from "@/helper/InstanceAxios";
import type {
  CreateSupportTicketPayload,
  CreateTicketMessagePayload,
} from "@/types/supportTypes";

type TicketQueryParams = Record<string, string | number | boolean | undefined>;

export const supportAPI = {
  get_all_tickets: (params?: TicketQueryParams) =>
    InstanceAxis.get("/support/support-tickets/", { params }),

  get_ticket_detail: (id: string) =>
    InstanceAxis.get(`/support/support-tickets/${id}/`),

  get_ticket_messages: (
    ticketId: string,
    params?: Record<string, string | number | boolean | undefined>
  ) =>
    InstanceAxis.get("/support/tickets-message/", {
      params: {
        ticket: ticketId,
        ...params,
      },
    }),

  create_ticket: (payload: CreateSupportTicketPayload) =>
    InstanceAxis.post("/support/support-tickets/", payload),

  update_ticket: (id: string, payload: Record<string, unknown>) =>
    InstanceAxis.patch(`/support/support-tickets/${id}/`, payload),

  resolve_ticket: (id: string) =>
    InstanceAxis.post(`/support/support-tickets/${id}/resolve/`),

  create_message: (payload: CreateTicketMessagePayload) =>
    InstanceAxis.post("/support/tickets-message/", payload),

  delete_ticket: (id: string) =>
    InstanceAxis.delete(`/support/support-tickets/${id}/`),
};