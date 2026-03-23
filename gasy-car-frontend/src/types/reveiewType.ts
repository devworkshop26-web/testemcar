import { Reservation } from "./reservationsType";
import { User } from "./userType";

export interface Review {
  id: string;
  reservation?: Reservation;
  author: User;
  target: User;
  review_type: "CLIENT_TO_OWNER" | "OWNER_TO_CLIENT";
  rating: number; // 1 à 5
  comment: string;
  is_verified: boolean;
  moderation_status: "PENDING" | "APPROVED" | "REJECTED";
  created_at: string;
  updated_at: string;
}

export interface CreateReviewPayload {
  reservation?: string;
  author: string;
  target: string;
  review_type: "CLIENT_TO_OWNER" | "OWNER_TO_CLIENT";
  rating: number;
  comment?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

export interface ModerateReviewPayload {
  moderation_status: "PENDING" | "APPROVED" | "REJECTED";
}
