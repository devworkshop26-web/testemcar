export interface SupportUser {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar_url?: string | null;
  phone_number?: string | null;
}

export interface TicketMessage {
  id: string;
  ticket: string;
  sender: string;
  sender_role?: "CLIENT" | "SUPPORT" | string;
  sender_name?: string;
  sender_avatar?: string | null;
  message: string;
  attachment_url?: string | null;
  is_support?: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  ticket_type: "TECHNICAL" | "CONFLICT" | "PAYMENT" | "OTHER";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  user: string;
  reservation?: string | null;
  vehicule?: string | null;
  assigned_admin?: string | null;
  created_at: string;
  updated_at?: string;
  last_activity_at?: string;

  user_detail?: SupportUser | null;
  last_message?: string | null;
  last_message_at?: string | null;
  unread_messages?: number;

  fullName?: string;
  avatar?: string | null;
}

export interface TicketGroup {
  userId: string;
  user: SupportUser | null;
  tickets: SupportTicket[];
  lastTicket: SupportTicket | null;
  unreadCount: number;
}