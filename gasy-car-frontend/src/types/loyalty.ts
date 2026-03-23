export type LoyaltyHistoryStatus = "earned" | "redeemed" | "pending";

export interface LoyaltyStat {
  label: string;
  value: string;
  helper: string;
}

export interface LoyaltyHistoryItem {
  id: string;
  title: string;
  date: string;
  points: number;
  status: LoyaltyHistoryStatus;
  description: string;
  source?: "reservation" | "review" | "profile" | "referral" | string;
}

export interface LoyaltyTier {
  name: string;
  thresholdLabel: string;
  active?: boolean;
  perks: string[];
}

export interface LoyaltyRules {
  reservationPoints: number;
  reviewPoints: number;
  profilePoints: number;
  referralEnabled: boolean;
}

export interface LoyaltyOverview {
  title: string;
  subtitle: string;
  points: number;
  nextTierLabel: string;
  pointsToNextTier: number;
  progress: number;
  memberSince: string;
  discountLabel: string;
  stats: LoyaltyStat[];
  history: LoyaltyHistoryItem[];
  tiers: LoyaltyTier[];
  rules: LoyaltyRules;
}
